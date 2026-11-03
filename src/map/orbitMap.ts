// The map's renderer: the site's notes as a small 3D graph, drawn on a plain 2D canvas (no WebGL). The layout is
// worked out once when the page opens (d3-force-3d, 300 steps, a few milliseconds for this many nodes) and then
// stays put. Each frame turns the points by two angles and applies a simple perspective (nearer points larger),
// so the graph reads as 3D while costing about what a flat drawing does. Nodes glow in their group's colour (the
// site's white, greys and orange) and each link takes the colour of the node it leads to, both drawn with additive
// blending so overlaps brighten like light.
// A sparse cloud of stars around the graph turns with it, which gives the eye a sense of depth; the deep-space
// backdrop behind it is plain CSS.
//
// Frames are drawn only when something changes: a drag, a zoom, a hover, a note firing, the slow drift. The
// drift runs at most 30 times a second, only after 4 seconds without input, only while the map is on screen,
// and never under reduced motion.
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  forceZ,
  type Link3D,
  type Node3D,
} from 'd3-force-3d';

export type Shape = 'circle' | 'ring' | 'square' | 'diamond' | 'triangle';

export interface MapNodeInput {
  id: string;
  title: string;
  group: string;
  shape: Shape;
  color: string;
  /** radius in CSS pixels at zoom 1, for a node at the middle depth */
  r: number;
  /** hubs keep their label on screen */
  hub: boolean;
}

export interface MapLinkInput {
  source: string;
  target: string;
}

export interface OrbitOptions {
  onSelect: (id: string | null) => void;
  onOpen: (id: string) => void;
  reducedMotion: boolean;
  /** colour of notes the guide just read */
  fireColor: string;
}

type Node = MapNodeInput & Node3D & { x: number; y: number; z: number; rgb: [number, number, number] };
interface Projected {
  x: number;
  y: number;
  /** perspective scale: above 1 in front of the middle, below 1 behind it */
  p: number;
  /** 0 nearest, 1 farthest */
  depth: number;
}
interface View {
  k: number;
  panX: number;
  panY: number;
}

const DUST = 160; // faint points around the graph that turn with it
const PAD = 56; // room around the graph when it is fitted
const FIRE_GAP = 150; // ms between notes in a recall
const FIRE_HOLD = 2200; // ms a fired note stays lit
const RING_MS = 600; // ms a firing ring takes to spread
const VIEW_MS = 450; // ms for a fit, a centre or a zoom button
const IDLE_MS = 4000; // ms without input before the drift starts
const DRIFT = 0.00005; // radians per ms of drift, about 3 degrees a second
const DRIFT_FRAME = 33; // ms between drift frames, so at most 30 a second
const ROTATE = 0.007; // radians per pixel dragged
const LEAN_YAW = 0.22; // how far the graph turns toward the mouse, in radians across the whole width
const LEAN_PITCH = 0.14;
const MIN_K = 0.35;
const MAX_K = 3.5;

const rgbOf = (hex: string): [number, number, number] => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};
const rgb = (c: [number, number, number]) => `rgb(${c.join(',')})`;
const mixRgb = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
  [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as [number, number, number];
const WHITE: [number, number, number] = [255, 255, 255];
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export class OrbitMap {
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private nodes: Node[];
  private byId = new Map<string, Node>();
  private links: { a: Node; b: Node; key: string }[];
  private near = new Map<string, Set<string>>();
  private fire: [number, number, number];
  private radius = 1; // bounding sphere of the layout, around its centre
  private focal = 3; // perspective distance, in layout units
  private proj = new Map<string, Projected>();
  private w = 0;
  private h = 0;
  private dpr = 1;
  private view: View = { k: 1, panX: 0, panY: 0 };
  private tween: { from: View; to: View; t0: number } | null = null;
  private yaw = -0.45;
  private pitch = 0.32;
  private lean = { yaw: 0, pitch: 0 };
  private leanTarget = { yaw: 0, pitch: 0 };
  // Room kept clear at the left and right edges (the legend, the guide panel), in CSS pixels. The graph's middle
  // eases toward the middle of what is left.
  private insets = { left: 0, right: 0 };
  private ax = 0;
  private touched = false;
  private hoverId: string | null = null;
  private selectedId: string | null = null;
  private isolated: string | null = null;
  private matches: Set<string> | null = null;
  private fired = new Map<string, number>();
  private firedLinks = new Map<string, number>();
  private raf = 0;
  private last = 0;
  private lastDrawn = 0;
  private lastInput = performance.now();
  private inView = true;
  private seen: IntersectionObserver;
  private timers = new Set<number>();
  private pointers = new Map<number, { x: number; y: number }>();
  private drag: { x: number; y: number; sx: number; sy: number; moved: boolean; pan: boolean } | null = null;
  private pinch: { d: number; k: number; mx: number; my: number } | null = null;
  private lastClick = { id: '', t: 0 };
  private dust: { x: number; y: number; z: number; s: number; tint: string }[] = [];
  private dead = false;

  constructor(private host: HTMLElement, nodes: MapNodeInput[], links: MapLinkInput[], private opts: OrbitOptions) {
    this.ctx = this.canvas.getContext('2d')!;
    this.fire = rgbOf(opts.fireColor);
    this.nodes = nodes.map((n) => ({ ...n, x: 0, y: 0, z: 0, rgb: rgbOf(n.color) }));
    for (const n of this.nodes) this.byId.set(n.id, n);
    this.links = links.map((l) => ({ a: this.byId.get(l.source)!, b: this.byId.get(l.target)!, key: pairKey(l.source, l.target) }));
    for (const { a, b } of this.links) {
      (this.near.get(a.id) ?? this.near.set(a.id, new Set()).get(a.id)!).add(b.id);
      (this.near.get(b.id) ?? this.near.set(b.id, new Set()).get(b.id)!).add(a.id);
    }
    this.layout(links);

    this.canvas.className = 'orbit-canvas';
    host.appendChild(this.canvas);
    this.canvas.addEventListener('pointerdown', this.onDown);
    this.canvas.addEventListener('pointermove', this.onMove);
    this.canvas.addEventListener('pointerup', this.onUp);
    this.canvas.addEventListener('pointercancel', this.onCancel);
    this.canvas.addEventListener('pointerleave', this.onLeave);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    // The drift only runs while the map is on screen.
    this.seen = new IntersectionObserver(([e]) => {
      this.inView = e.isIntersecting;
      this.request();
    });
    this.seen.observe(host);
    this.resize();
  }

  // ---------- layout ----------

  /** Spreads the nodes once in 3D: links pull related notes together, every node pushes the others away, and a
   *  light pull to the middle keeps small groups from drifting off. The random source is seeded, so the map
   *  looks the same on every visit. The result is centred on its middle and measured for the perspective. */
  private layout(links: MapLinkInput[]) {
    const simLinks: Link3D<Node>[] = links.map((l) => ({ source: l.source, target: l.target }));
    forceSimulation<Node>(this.nodes, 3)
      .force(
        'link',
        forceLink<Node, Link3D<Node>>(simLinks)
          .id((d) => d.id)
          .distance((l) => ((l.source as Node).hub && (l.target as Node).hub ? 90 : 46))
          .strength(0.6),
      )
      .force('charge', forceManyBody<Node>().strength((d) => (d.hub ? -420 : -150)).distanceMax(420))
      .force('collide', forceCollide<Node>().radius((d) => d.r + 9))
      .force('x', forceX<Node>(0).strength(0.035))
      .force('y', forceY<Node>(0).strength(0.045))
      .force('z', forceZ<Node>(0).strength(0.04))
      .stop()
      .tick(300);
    const n = this.nodes.length || 1;
    const c = this.nodes.reduce((a, d) => ({ x: a.x + d.x / n, y: a.y + d.y / n, z: a.z + d.z / n }), { x: 0, y: 0, z: 0 });
    for (const d of this.nodes) {
      d.x -= c.x;
      d.y -= c.y;
      d.z -= c.z;
    }
    this.radius = Math.max(1, ...this.nodes.map((d) => Math.hypot(d.x, d.y, d.z) + d.r));
    this.focal = this.radius * 3;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    this.dust = Array.from({ length: DUST }, () => {
      // A point on a shell from 0.9 to 1.6 times the graph's radius, kept in front of the camera.
      const u = rnd() * 2 - 1;
      const t = rnd() * Math.PI * 2;
      const r = this.radius * (0.9 + rnd() * 0.7);
      const sq = Math.sqrt(1 - u * u);
      const tint = ['#ffffff', '#ffffff', '#e8e8e8', '#ffe2cc', '#ffffff'][Math.floor(rnd() * 5)];
      return { x: r * sq * Math.cos(t), y: r * u * 0.8, z: r * sq * Math.sin(t) * 0.9, s: 1 + rnd() * 1.6, tint };
    });
  }

  // ---------- public controls ----------

  resize() {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (w < 2 || h < 2) return;
    this.w = w;
    this.h = h;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ax = this.anchorX();
    if (!this.touched) this.view = this.fitted();
    this.request();
  }

  /** Frames the whole graph in the space between the insets. */
  fit() {
    this.touched = false;
    this.goTo(this.fitted());
  }

  /** Keeps the zoom and brings the graph's middle back to the middle of the space. */
  center() {
    this.goTo({ ...this.view, panX: 0, panY: 0 });
  }

  zoomBy(factor: number) {
    this.touched = true;
    this.goTo({ ...this.view, k: clamp(this.view.k * factor, MIN_K, MAX_K) });
  }

  /** Keeps room clear at the edges for a panel. The graph's middle eases into the space that is left, and an
   *  untouched view refits to it. */
  setInsets(left: number, right: number) {
    this.insets = { left: Math.max(0, left), right: Math.max(0, right) };
    if (this.opts.reducedMotion) this.ax = this.anchorX();
    if (!this.touched) this.goTo(this.fitted());
    else this.request();
  }

  select(id: string | null) {
    this.selectedId = id && this.byId.has(id) ? id : null;
    this.opts.onSelect(this.selectedId);
    this.request();
  }

  isolate(group: string | null) {
    this.isolated = group;
    this.request();
  }

  /** Lights the nodes whose title contains the query and returns how many matched; an empty query clears it. */
  search(query: string): number {
    const q = query.trim().toLowerCase();
    this.matches = q ? new Set(this.nodes.filter((n) => n.title.toLowerCase().includes(q)).map((n) => n.id)) : null;
    this.request();
    return this.matches?.size ?? 0;
  }

  /** The guide looked these notes up for a question: they light one after another, joined by the links
   *  between them when there are any. */
  fireRecall(ids: string[]) {
    const present = ids.filter((id) => this.byId.has(id));
    present.forEach((id, i) => {
      this.later(() => {
        const now = performance.now();
        this.fired.set(id, now);
        const prev = present[i - 1];
        if (prev && this.near.get(prev)?.has(id)) this.firedLinks.set(pairKey(prev, id), now);
        this.request();
      }, this.opts.reducedMotion ? 0 : i * FIRE_GAP);
    });
  }

  setReducedMotion(on: boolean) {
    this.opts.reducedMotion = on;
    if (on) this.leanTarget = { yaw: 0, pitch: 0 };
    this.request();
  }

  destroy() {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    this.seen.disconnect();
    for (const t of this.timers) window.clearTimeout(t);
    this.timers.clear();
    this.canvas.remove();
  }

  // ---------- frames ----------

  /** Asks for one frame. A frame asks for the next only while something is still moving. */
  private request() {
    if (this.raf || this.dead) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  private drifting(now: number) {
    return !this.opts.reducedMotion && this.inView && !this.drag && !this.pinch && now - this.lastInput > IDLE_MS;
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min(64, now - (this.last || now));
    this.last = now;
    let moving = false;

    if (this.tween) {
      const e = Math.min(1, (now - this.tween.t0) / VIEW_MS);
      const t = easeOut(e);
      const { from, to } = this.tween;
      this.view = { k: from.k + (to.k - from.k) * t, panX: from.panX + (to.panX - from.panX) * t, panY: from.panY + (to.panY - from.panY) * t };
      if (e >= 1) this.tween = null;
      else moving = true;
    }
    const axTarget = this.anchorX();
    if (Math.abs(axTarget - this.ax) > 0.5) {
      this.ax += (axTarget - this.ax) * Math.min(1, dt / 110);
      moving = true;
    } else this.ax = axTarget;
    for (const key of ['yaw', 'pitch'] as const) {
      const d = this.leanTarget[key] - this.lean[key];
      if (Math.abs(d) > 0.0005) {
        this.lean[key] += d * Math.min(1, dt / 160);
        moving = true;
      } else this.lean[key] = this.leanTarget[key];
    }
    for (const [id, t0] of this.fired) if (now - t0 > FIRE_HOLD) this.fired.delete(id);
    for (const [key, t0] of this.firedLinks) if (now - t0 > FIRE_HOLD) this.firedLinks.delete(key);
    if (this.fired.size || this.firedLinks.size) moving = true;

    const drift = this.drifting(now);
    if (drift) this.yaw += DRIFT * dt;
    // While only the drift moves, skip frames down to about 30 a second.
    if (!moving && drift && now - this.lastDrawn < DRIFT_FRAME) {
      this.request();
      return;
    }
    this.draw(now);
    this.lastDrawn = now;
    if (moving || drift) this.request();
    // Not drifting yet: wake when the idle wait ends.
    else if (!this.opts.reducedMotion && this.inView) this.later(() => this.request(), IDLE_MS - (now - this.lastInput) + 20);
  };

  private project(n: { x: number; y: number; z: number }): Projected {
    const yaw = this.yaw + this.lean.yaw;
    const pitch = this.pitch + this.lean.pitch;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const x1 = n.x * cy + n.z * sy;
    const z1 = -n.x * sy + n.z * cy;
    const y2 = n.y * cp - z1 * sp;
    const z2 = n.y * sp + z1 * cp;
    const p = this.focal / (this.focal + z2);
    return {
      x: this.ax + x1 * p * this.view.k + this.view.panX,
      y: this.h / 2 + y2 * p * this.view.k + this.view.panY,
      p,
      depth: clamp((z2 + this.radius) / (2 * this.radius), 0, 1),
    };
  }

  private draw(now: number) {
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);

    // Dust: tiny points in a shell around the graph, turned and projected like the nodes, dimmer the farther away.
    for (const d of this.dust) {
      const q = this.project(d);
      if (q.x < 0 || q.y < 0 || q.x > this.w || q.y > this.h) continue;
      c.fillStyle = d.tint;
      c.globalAlpha = 0.08 + 0.3 * (1 - q.depth);
      const r = d.s * q.p;
      c.fillRect(q.x - r / 2, q.y - r / 2, r, r);
    }
    c.globalAlpha = 1;

    for (const n of this.nodes) this.proj.set(n.id, this.project(n));
    const lit = this.litSet();
    const focus = this.hoverId ?? this.selectedId;
    const zoomScale = clamp(Math.sqrt(this.view.k), 0.75, 1.5);

    // Links glow in the colour of the smaller node they join (the part, tool or skill), so each cluster reads
    // in its own colour. Additive blending makes crossings brighter, like light.
    c.globalCompositeOperation = 'lighter';
    for (const l of this.links) {
      const a = this.proj.get(l.a.id)!;
      const b = this.proj.get(l.b.id)!;
      const fade = 1 - 0.55 * ((a.depth + b.depth) / 2);
      const fireT = this.firedLinks.get(l.key);
      const on = !lit || (lit.has(l.a.id) && lit.has(l.b.id));
      const touches = focus !== null && (l.a.id === focus || l.b.id === focus);
      const tone = (l.a.r <= l.b.r ? l.a : l.b).rgb;
      if (fireT !== undefined) {
        c.strokeStyle = `rgba(${this.fire.join(',')},${0.35 + 0.6 * this.fade(now - fireT)})`;
        c.lineWidth = 2;
      } else {
        c.strokeStyle = `rgba(${tone.join(',')},${(touches ? 0.9 : on ? 0.44 : 0.05) * (touches ? 1 : fade)})`;
        c.lineWidth = touches ? 1.6 : 1.1;
      }
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(b.x, b.y);
      c.stroke();
    }
    c.globalCompositeOperation = 'source-over';

    // Far nodes first, so nearer ones sit on top.
    const order = [...this.nodes].sort((m, n) => this.proj.get(n.id)!.depth - this.proj.get(m.id)!.depth);
    for (const n of order) {
      const q = this.proj.get(n.id)!;
      if (q.x < -40 || q.y < -40 || q.x > this.w + 40 || q.y > this.h + 40) continue;
      const r = n.r * zoomScale * q.p + (n.id === focus ? 1.5 : 0);
      const fireT = this.fired.get(n.id);
      const f = fireT === undefined ? 0 : this.fade(now - fireT);
      const dimmed = lit && !lit.has(n.id) && !f;
      c.globalAlpha = dimmed ? 0.15 : Math.max(0.4, 1 - 0.55 * q.depth);
      const base = f ? mixRgb(n.rgb, this.fire, f) : n.rgb;
      // A soft halo in the node's colour, added to whatever is behind it.
      const halo = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * (f ? 5 : 3.4));
      halo.addColorStop(0, `rgba(${base.join(',')},${dimmed ? 0.08 : f ? 0.65 : 0.55})`);
      halo.addColorStop(1, `rgba(${base.join(',')},0)`);
      c.globalCompositeOperation = 'lighter';
      c.fillStyle = halo;
      c.beginPath();
      c.arc(q.x, q.y, r * (f ? 5 : 3.4), 0, Math.PI * 2);
      c.fill();
      c.globalCompositeOperation = 'source-over';
      this.shape(n.shape, q.x, q.y, r, base, n.id === focus || f > 0);
      if (fireT !== undefined && !this.opts.reducedMotion) {
        const e = (now - fireT) / RING_MS;
        if (e < 1) {
          c.globalAlpha = 1;
          c.strokeStyle = `rgba(${this.fire.join(',')},${0.8 * (1 - e)})`;
          c.lineWidth = 1.5;
          c.beginPath();
          c.arc(q.x, q.y, r + 4 + 18 * easeOut(e), 0, Math.PI * 2);
          c.stroke();
        }
      }
    }
    c.globalAlpha = 1;

    // Labels: hubs always; on hover or selection, the node and its closest neighbours; search matches; notes that
    // are firing. Drawn far to near, like the nodes.
    const named = new Set<string>();
    for (const n of this.nodes) if (n.hub && (!lit || lit.has(n.id))) named.add(n.id);
    if (focus) {
      named.add(focus);
      [...(this.near.get(focus) ?? [])].slice(0, 10).forEach((id) => named.add(id));
    }
    this.matches?.forEach((id) => named.add(id));
    this.fired.forEach((_t, id) => named.add(id));
    const labels = [...named].sort((a, b) => this.proj.get(b)!.depth - this.proj.get(a)!.depth);
    for (const id of labels) {
      const n = this.byId.get(id)!;
      const q = this.proj.get(id)!;
      c.globalAlpha = id === focus || this.fired.has(id) ? 1 : Math.max(0.55, 1 - 0.5 * q.depth);
      this.label(n, q.x + n.r * zoomScale * q.p + 7, q.y, id === focus, this.fired.has(id));
    }
    c.globalAlpha = 1;
  }

  /** 1 while a fired note is fresh, easing to 0 over its last half; a steady 1 under reduced motion. */
  private fade(age: number) {
    if (this.opts.reducedMotion) return age < FIRE_HOLD * 0.6 ? 1 : 0;
    const half = FIRE_HOLD / 2;
    return age < half ? 1 : Math.max(0, 1 - (age - half) / half);
  }

  /** Draws a node lit from the upper left, which is most of what makes the graph read as solid. */
  private shape(shape: Shape, x: number, y: number, r: number, color: [number, number, number], strong: boolean) {
    const c = this.ctx;
    const g = c.createRadialGradient(x - r * 0.4, y - r * 0.45, r * 0.1, x, y, r * 1.2);
    g.addColorStop(0, rgb(mixRgb(color, WHITE, 0.55)));
    g.addColorStop(1, rgb(color));
    c.lineWidth = strong ? 2 : 1.5;
    c.beginPath();
    if (shape === 'square') c.rect(x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8);
    else if (shape === 'triangle') {
      c.moveTo(x, y - r * 1.25);
      c.lineTo(x + r * 1.15, y + r * 0.8);
      c.lineTo(x - r * 1.15, y + r * 0.8);
      c.closePath();
    }
    else if (shape === 'diamond') {
      c.moveTo(x, y - r * 1.2);
      c.lineTo(x + r * 1.2, y);
      c.lineTo(x, y + r * 1.2);
      c.lineTo(x - r * 1.2, y);
      c.closePath();
    } else c.arc(x, y, r, 0, Math.PI * 2);
    if (shape === 'ring') {
      c.fillStyle = '#0a0a0c';
      c.fill();
      c.strokeStyle = rgb(color);
      c.stroke();
    } else {
      c.fillStyle = g;
      c.fill();
      if (strong) {
        c.strokeStyle = 'rgba(255,255,255,0.9)';
        c.stroke();
      }
    }
  }

  private label(n: Node, x: number, y: number, focus: boolean, firing: boolean) {
    const c = this.ctx;
    const text = n.hub ? n.title.toUpperCase() : n.title;
    c.font = `500 ${n.hub ? 10.5 : 11}px "Geist Mono", ui-monospace, monospace`;
    const tw = c.measureText(text).width;
    const h = 18;
    c.fillStyle = 'rgba(11,11,12,0.86)';
    c.strokeStyle = firing ? `rgba(${this.fire.join(',')},0.8)` : focus ? 'rgba(255,255,255,0.5)' : `rgba(${n.rgb.join(',')},0.45)`;
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x, y - h / 2, tw + 14, h, 9);
    c.fill();
    c.stroke();
    c.fillStyle = focus || firing || n.hub ? '#f2f2f2' : '#c4c4c4';
    c.textBaseline = 'middle';
    c.fillText(text, x + 7, y + 0.5);
  }

  /** Which nodes are lit: the hovered or selected node and its neighbours, else an isolated group, else search
   *  matches, else all of them (null). */
  private litSet(): Set<string> | null {
    const focus = this.hoverId ?? this.selectedId;
    if (focus) return new Set([focus, ...(this.near.get(focus) ?? [])]);
    if (this.isolated) return new Set(this.nodes.filter((n) => n.group === this.isolated).map((n) => n.id));
    return this.matches;
  }

  // ---------- view maths ----------

  /** A zoom that fits the graph, as it is turned right now, into the space between the insets, with some
   *  headroom because turning changes its outline. */
  private fitted(): View {
    const pad = Math.min(PAD, this.w * 0.06);
    const room = Math.min(80, this.w * 0.12); // labels grow to the right of their node
    const availW = Math.max(120, this.w - this.insets.left - this.insets.right - pad * 2 - room);
    const availH = Math.max(120, this.h - pad * 2);
    const yaw = this.yaw + this.lean.yaw;
    const pitch = this.pitch + this.lean.pitch;
    let maxX = 1;
    let maxY = 1;
    for (const n of this.nodes) {
      const x1 = n.x * Math.cos(yaw) + n.z * Math.sin(yaw);
      const z1 = -n.x * Math.sin(yaw) + n.z * Math.cos(yaw);
      const y2 = n.y * Math.cos(pitch) - z1 * Math.sin(pitch);
      const z2 = n.y * Math.sin(pitch) + z1 * Math.cos(pitch);
      const p = this.focal / (this.focal + z2);
      maxX = Math.max(maxX, Math.abs(x1 * p) + n.r);
      maxY = Math.max(maxY, Math.abs(y2 * p) + n.r);
    }
    const k = clamp(0.85 * Math.min(availW / (2 * maxX), availH / (2 * maxY)), MIN_K, MAX_K);
    return { k, panX: 0, panY: 0 };
  }

  /** Where the graph's middle sits across the view: the middle of the space between the insets, nudged left to
   *  leave room for labels. */
  private anchorX() {
    return this.insets.left + (this.w - this.insets.left - this.insets.right) / 2 - Math.min(30, this.w * 0.05);
  }

  private goTo(to: View) {
    if (this.opts.reducedMotion || !this.w) {
      this.view = to;
      this.tween = null;
    } else this.tween = { from: { ...this.view }, to, t0: performance.now() };
    this.request();
  }

  private nodeAt(px: number, py: number): Node | null {
    const zoomScale = clamp(Math.sqrt(this.view.k), 0.75, 1.5);
    let best: Node | null = null;
    let bestScore = Infinity;
    for (const n of this.nodes) {
      const q = this.proj.get(n.id);
      if (!q) continue;
      const d = Math.hypot(q.x - px, q.y - py);
      // Where nodes overlap, the nearer one wins.
      if (d <= Math.max(12, n.r * zoomScale * q.p + 6) && d + q.depth * 6 < bestScore) {
        best = n;
        bestScore = d + q.depth * 6;
      }
    }
    return best;
  }

  // ---------- input ----------

  private local(e: PointerEvent | WheelEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private touch() {
    this.lastInput = performance.now();
  }

  private onDown = (e: PointerEvent) => {
    this.touch();
    const p = this.local(e);
    this.pointers.set(e.pointerId, p);
    this.canvas.setPointerCapture(e.pointerId);
    if (this.pointers.size === 1) this.drag = { x: p.x, y: p.y, sx: p.x, sy: p.y, moved: false, pan: e.shiftKey || e.button === 1 };
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: this.view.k, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
      this.drag = null;
    }
  };

  private onMove = (e: PointerEvent) => {
    const p = this.local(e);
    if (this.pointers.has(e.pointerId)) this.pointers.set(e.pointerId, p);
    if (this.pinch && this.pointers.size === 2) {
      // Two fingers: spread to zoom, move together to pan.
      this.touch();
      const [a, b] = [...this.pointers.values()];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      this.touched = true;
      this.tween = null;
      this.view = {
        k: clamp(this.pinch.k * (Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d), MIN_K, MAX_K),
        panX: this.view.panX + mx - this.pinch.mx,
        panY: this.view.panY + my - this.pinch.my,
      };
      this.pinch.mx = mx;
      this.pinch.my = my;
      this.request();
      return;
    }
    if (this.drag) {
      this.touch();
      const dx = p.x - this.drag.x;
      const dy = p.y - this.drag.y;
      if (!this.drag.moved && Math.hypot(p.x - this.drag.sx, p.y - this.drag.sy) > 4) this.drag.moved = true;
      if (this.drag.moved) {
        if (this.drag.pan) {
          this.touched = true;
          this.tween = null;
          this.view = { ...this.view, panX: this.view.panX + dx, panY: this.view.panY + dy };
        } else {
          this.yaw += dx * ROTATE;
          this.pitch = clamp(this.pitch + dy * ROTATE, -1.3, 1.3);
        }
        this.drag.x = p.x;
        this.drag.y = p.y;
        this.canvas.style.cursor = 'grabbing';
        this.request();
      }
      return;
    }
    if (e.pointerType !== 'mouse') return;
    this.touch();
    // The graph turns a little toward the mouse.
    if (!this.opts.reducedMotion) this.leanTarget = { yaw: (p.x / this.w - 0.5) * LEAN_YAW, pitch: (p.y / this.h - 0.5) * LEAN_PITCH };
    const hit = this.nodeAt(p.x, p.y);
    const id = hit?.id ?? null;
    this.canvas.style.cursor = hit ? 'pointer' : 'grab';
    if (id !== this.hoverId) this.hoverId = id;
    this.request();
  };

  private onUp = (e: PointerEvent) => {
    const p = this.local(e);
    const wasDrag = this.drag;
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = null;
    this.drag = null;
    this.canvas.style.cursor = '';
    if (!wasDrag || wasDrag.moved) return;
    const hit = this.nodeAt(p.x, p.y);
    if (!hit) {
      this.select(null);
      return;
    }
    const now = performance.now();
    if (e.ctrlKey || e.metaKey || (this.lastClick.id === hit.id && now - this.lastClick.t < 380)) {
      this.lastClick = { id: '', t: 0 };
      this.opts.onOpen(hit.id);
      return;
    }
    this.lastClick = { id: hit.id, t: now };
    this.select(hit.id);
  };

  private onCancel = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    this.pinch = null;
    this.drag = null;
  };

  private onLeave = () => {
    this.leanTarget = { yaw: 0, pitch: 0 };
    if (this.hoverId) this.hoverId = null;
    this.request();
  };

  // A plain scroll keeps scrolling the page, so the map never traps it. Ctrl or Cmd with the wheel zooms, and a
  // trackpad pinch arrives as a wheel event with ctrlKey set.
  private onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    this.touch();
    this.touched = true;
    this.tween = null;
    this.view = { ...this.view, k: clamp(this.view.k * Math.exp(-e.deltaY * 0.01), MIN_K, MAX_K) };
    this.request();
  };

  private later(fn: () => void, ms: number) {
    const t = window.setTimeout(() => {
      this.timers.delete(t);
      if (!this.dead) fn();
    }, ms);
    this.timers.add(t);
  }
}
