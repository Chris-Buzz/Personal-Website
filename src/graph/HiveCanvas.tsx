import { useEffect, useMemo, useRef, useState } from 'react';
import { nodes as DATA, edges as EDGES, TYPE_META, type NodeType } from '../data/hive';
import { useBuzzy } from '../context/BuzzyContext';
import { Icon } from '../components/IconSprite';

interface SimNode {
  label: string; type: NodeType; desc: string;
  x: number; y: number; vx: number; vy: number;
  alpha: number; alphaT: number; scale: number; scaleT: number; r: number;
}

const FILTERS: { key: string; label: string; color: string }[] = [
  { key: 'all', label: 'Everything', color: 'var(--ink-3)' },
  { key: 'project', label: 'Projects', color: 'var(--orange)' },
  { key: 'post', label: 'Posts', color: 'var(--honey)' },
  { key: 'skill', label: 'Skills', color: 'var(--taupe)' },
  { key: 'life', label: 'Life', color: 'var(--sage)' },
];

/**
 * Force-directed knowledge graph on a 2D canvas. Physics "sleeps" once settled.
 * Selection state lives in React (to render the panel); the canvas reads live
 * values through refs so the animation loop never restarts.
 */
export default function HiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ask } = useBuzzy();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filterRef = useRef(filter);
  const searchRef = useRef(search);
  filterRef.current = filter;
  searchRef.current = search;

  // Imperative API the React panel uses to drive the canvas.
  const apiRef = useRef<{ select: (i: number) => void; deselect: () => void; panTo: (i: number) => void } | null>(null);

  // neighbor adjacency (stable)
  const nb = useMemo(() => {
    const m = DATA.map(() => new Set<number>());
    EDGES.forEach(([a, b]) => { m[a].add(b); m[b].add(a); });
    return m;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const deg = DATA.map((_, i) => nb[i].size);
    const anchorA: Record<string, number> = { project: -2.1, post: -0.4, skill: 1.25, life: 2.9 };

    const sim: SimNode[] = DATA.map((n, i) => {
      const a = anchorA[n.type] + (Math.random() - 0.5) * 1.1;
      const r = 120 + Math.random() * 150;
      return {
        ...n,
        x: Math.cos(a) * r, y: Math.sin(a) * r * 0.72, vx: 0, vy: 0,
        alpha: 1, alphaT: 1, scale: 1, scaleT: 1,
        r: TYPE_META[n.type].r + Math.min(6, deg[i] * 0.7),
      };
    });

    const view = { x: 0, y: 0, k: 1, xT: 0, yT: 0, kT: 1 };
    let W = 0, H = 0, DPR = 1, energy = 1;
    let hover = -1, sel = -1, dragNode = -1, panning = false, px = 0, py = 0, moved = 0, downOnCanvas = false;
    let backdrop: HTMLCanvasElement | null = null;

    let col: Record<string, string> = {};
    function readTheme() {
      const s = getComputedStyle(document.documentElement);
      const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
      col = {
        project: v('--orange', '#D9701E'), post: v('--honey', '#DFA251'),
        skill: v('--taupe', '#B0A188'), life: v('--sage', '#8F9C72'),
        edge: v('--line', '#E6DBC5'), label: v('--ink-2', '#6E6350'),
        strong: v('--ink', '#241E17'), bg: v('--bg', '#FAF6EE'), orange: v('--orange', '#D9701E'),
      };
    }
    readTheme();
    window.__hiveTheme = () => { readTheme(); buildBackdrop(); };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      DPR = Math.min(window.devicePixelRatio, 2);
      if (rect.width === W && rect.height === H && canvas.width === ((W * DPR) | 0)) return;
      W = rect.width; H = rect.height; canvas.width = W * DPR; canvas.height = H * DPR;
      energy = 1;
    }

    const matches = (n: SimNode) =>
      (filterRef.current === 'all' || n.type === filterRef.current) &&
      (!searchRef.current || n.label.toLowerCase().includes(searchRef.current));
    const emphasized = (i: number) => {
      if (sel >= 0) return i === sel || nb[sel].has(i);
      if (hover >= 0) return i === hover || nb[hover].has(i);
      return true;
    };

    function step() {
      let move = 0;
      for (let i = 0; i < sim.length; i++)
        for (let j = i + 1; j < sim.length; j++) {
          const a = sim[i], b = sim[j];
          let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 < 4) d2 = 4;
          const d = Math.sqrt(d2), f = 2600 / d2;
          dx /= d; dy /= d;
          a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
        }
      EDGES.forEach(([i, j]) => {
        const a = sim[i], b = sim[j];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 110) * 0.0042;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      });
      sim.forEach((n, i) => {
        const ca = anchorA[n.type];
        const cx = Math.cos(ca) * Math.min(W, H) * 0.21, cy = Math.sin(ca) * Math.min(W, H) * 0.16;
        n.vx += (cx - n.x) * 0.0016 - n.x * 0.0012;
        n.vy += (cy - n.y) * 0.0016 - n.y * 0.0016;
        n.vx *= 0.87; n.vy *= 0.87;
        if (i !== dragNode) { n.x += n.vx; n.y += n.vy; }
        move += Math.abs(n.vx) + Math.abs(n.vy);
      });
      return move / sim.length;
    }

    const toWorld = (cx: number, cy: number): [number, number] => [(cx - W / 2 - view.x) / view.k, (cy - H / 2 - view.y) / view.k];
    function pick(cx: number, cy: number) {
      const [x, y] = toWorld(cx, cy);
      let best = -1, bd = 1e9;
      sim.forEach((n, i) => {
        const r = (n.r + 9) / Math.min(1, view.k * 1.1);
        const d = (n.x - x) ** 2 + (n.y - y) ** 2;
        if (d < r * r && d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function hexPath(x: number, y: number, r: number) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + (k * Math.PI) / 3, px2 = x + Math.cos(a) * r, py2 = y + Math.sin(a) * r;
        k ? ctx.lineTo(px2, py2) : ctx.moveTo(px2, py2);
      }
      ctx.closePath();
    }
    function buildBackdrop() {
      if (!W) return;
      backdrop = document.createElement('canvas');
      backdrop.width = W * DPR; backdrop.height = H * DPR;
      const b = backdrop.getContext('2d')!;
      b.setTransform(DPR, 0, 0, DPR, 0, 0);
      b.globalAlpha = 0.05; b.strokeStyle = col.orange; b.lineWidth = 1;
      const hexS = 46;
      for (let gy = 0; gy < H + hexS; gy += hexS * 1.5)
        for (let gx = ((gy / (hexS * 1.5)) | 0) % 2 ? hexS * 0.866 : 0; gx < W + hexS; gx += hexS * 1.732) {
          b.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = Math.PI / 6 + (k * Math.PI) / 3, px2 = gx + Math.cos(a) * hexS * 0.32, py2 = gy + Math.sin(a) * hexS * 0.32;
            k ? b.lineTo(px2, py2) : b.moveTo(px2, py2);
          }
          b.closePath(); b.stroke();
        }
    }

    let t = 0;
    function draw() {
      t += 0.016;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (backdrop) ctx.drawImage(backdrop, 0, 0);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.save();
      ctx.translate(W / 2 + view.x, H / 2 + view.y);
      ctx.scale(view.k, view.k);

      EDGES.forEach(([i, j], ei) => {
        const a = sim[i], b = sim[j];
        const emph = emphasized(i) && emphasized(j), mA = matches(a), mB = matches(b);
        const focus = (sel >= 0 && (i === sel || j === sel)) || (hover >= 0 && (i === hover || j === hover));
        const alpha = !mA || !mB ? 0.05 : emph ? (focus ? 0.85 : 0.34) : 0.06;
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, col[a.type]); g.addColorStop(1, col[b.type]);
        ctx.strokeStyle = g; ctx.globalAlpha = alpha; ctx.lineWidth = (focus ? 1.8 : 1.1) / view.k;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (focus) {
          const ph = (t * 0.5 + ei * 0.13) % 1, fx = i === (sel >= 0 ? sel : hover) ? a : b, tx2 = fx === a ? b : a;
          const pxp = fx.x + (tx2.x - fx.x) * ph, pyp = fx.y + (tx2.y - fx.y) * ph;
          ctx.globalAlpha = (1 - ph) * 0.9; ctx.fillStyle = col.orange;
          ctx.beginPath(); ctx.arc(pxp, pyp, 2.4 / view.k, 0, 7); ctx.fill();
        }
      });

      sim.forEach((n, i) => {
        const m = matches(n), emph = emphasized(i);
        n.alphaT = !m ? 0.08 : emph ? 1 : 0.13;
        n.scaleT = i === hover || i === sel ? 1.22 : 1;
        n.alpha += (n.alphaT - n.alpha) * 0.14;
        n.scale += (n.scaleT - n.scale) * 0.18;
        const r = n.r * n.scale;
        ctx.globalAlpha = n.alpha;
        const focus = i === hover || i === sel;
        if (focus) {
          const halo = ctx.createRadialGradient(n.x, n.y, r * 0.4, n.x, n.y, r * 3.2);
          halo.addColorStop(0, 'rgba(217,112,30,.34)'); halo.addColorStop(1, 'rgba(217,112,30,0)');
          ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(n.x, n.y, r * 3.2, 0, 7); ctx.fill();
        }
        if (i === sel) {
          ctx.strokeStyle = col.orange; ctx.lineWidth = 1.6 / view.k;
          ctx.setLineDash([4 / view.k, 5 / view.k]); ctx.lineDashOffset = (-t * 16) / view.k;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 9 / view.k, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        }
        ctx.fillStyle = col[n.type];
        if (n.type === 'project') {
          hexPath(n.x, n.y, r + 2.5); ctx.fill();
          if (focus) { ctx.strokeStyle = col.strong; ctx.lineWidth = 1.5 / view.k; ctx.stroke(); }
        } else if (n.type === 'post') {
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
          ctx.strokeStyle = col[n.type]; ctx.lineWidth = 1.2 / view.k;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 4 / view.k, 0, 7); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
          if (focus) { ctx.strokeStyle = col.strong; ctx.lineWidth = 1.4 / view.k; ctx.stroke(); }
        }
        const showLabel = m && (emph || n.type === 'project' || view.k > 1.5);
        if (showLabel) {
          const fs = (n.type === 'project' ? 12 : 10.5) / Math.sqrt(view.k);
          ctx.font = `${n.type === 'project' ? '600 ' : '500 '}${fs}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.globalAlpha = n.alpha * (emph ? 1 : 0.42);
          ctx.lineWidth = 3.5 / view.k; ctx.strokeStyle = col.bg;
          ctx.strokeText(n.label, n.x, n.y + r + 15 / view.k);
          ctx.fillStyle = focus ? col.strong : col.label;
          ctx.fillText(n.label, n.x, n.y + r + 15 / view.k);
        }
      });
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // ── pointer interaction ──
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect(), cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      if (dragNode >= 0) {
        const [x, y] = toWorld(cx, cy); sim[dragNode].x = x; sim[dragNode].y = y; sim[dragNode].vx = 0; sim[dragNode].vy = 0;
        moved += Math.abs(cx - px) + Math.abs(cy - py); energy = 1;
      } else if (panning) {
        view.xT += cx - px; view.yT += cy - py; moved += Math.abs(cx - px) + Math.abs(cy - py);
      } else {
        const h = pick(cx, cy); if (h !== hover) { hover = h; energy = Math.max(energy, 0.25); }
        canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab';
      }
      px = cx; py = cy;
    };
    const onDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left; py = e.clientY - rect.top; moved = 0; downOnCanvas = true;
      const i = pick(px, py); if (i >= 0) dragNode = i; else { panning = true; canvas.style.cursor = 'grabbing'; }
    };
    const onUp = (e: MouseEvent) => {
      if (downOnCanvas && moved < 5) {
        const rect = canvas.getBoundingClientRect(), i = pick(e.clientX - rect.left, e.clientY - rect.top);
        if (i >= 0) selectNode(i); else deselect();
      }
      downOnCanvas = false; dragNode = -1; panning = false;
      if (canvas.style.cursor === 'grabbing') canvas.style.cursor = 'grab';
    };
    const onLeave = () => { hover = -1; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect(), cx = e.clientX - rect.left - W / 2, cy = e.clientY - rect.top - H / 2, old = view.kT;
      view.kT = Math.max(0.45, Math.min(2.6, view.kT * Math.exp(-e.deltaY * 0.0011)));
      const f = view.kT / old; view.xT = cx - (cx - view.xT) * f; view.yT = cy - (cy - view.yT) * f;
    };
    const onDbl = () => { view.xT = 0; view.yT = 0; view.kT = 1; };

    function panTo(i: number) { const n = sim[i]; view.xT = -n.x * view.kT; view.yT = -n.y * view.kT; }
    function selectNode(i: number) { sel = i; energy = Math.max(energy, 0.3); setSelected(i); }
    function deselect() { sel = -1; setSelected(null); }
    apiRef.current = { select: (i) => { selectNode(i); panTo(i); }, deselect, panTo };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('dblclick', onDbl);

    // settle the layout before first paint
    W = canvas.clientWidth || window.innerWidth; H = canvas.clientHeight || window.innerHeight;
    for (let k = 0; k < 240; k++) step();
    buildBackdrop();

    let raf = 0;
    function loop() {
      raf = requestAnimationFrame(loop);
      resize();
      if (!W) return;
      if (!backdrop) buildBackdrop();
      view.x += (view.xT - view.x) * 0.12;
      view.y += (view.yT - view.y) * 0.12;
      view.k += (view.kT - view.k) * 0.12;
      if (energy > 0.02) { const m = step(); energy = m > 0.05 ? 1 : energy * 0.92; }
      draw();
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDbl);
      if (window.__hiveTheme) delete window.__hiveTheme;
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nb]);

  const node = selected != null ? DATA[selected] : null;
  const related = selected != null ? [...nb[selected]].slice(0, 8) : [];

  return (
    <>
      <canvas id="hive-canvas" ref={canvasRef} />
      <div className="hive-veil" />

      <div className="hive-search">
        <Icon name="search" style={{ width: 15, height: 15 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search) {
              const i = DATA.findIndex((n) => n.label.toLowerCase().includes(search));
              if (i >= 0) apiRef.current?.select(i);
            }
          }}
          placeholder="Search the graph…"
          autoComplete="off"
        />
      </div>

      <div className="hive-dock">
        {FILTERS.map((f) => (
          <button key={f.key} className={`chip${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
            <i style={{ background: f.color }} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="hive-legendnote">
        Drag node to pin · scroll to zoom
        <br />
        double-click background to reset
      </div>

      <aside className={`node-panel${node ? ' show' : ''}`}>
        <button className="np-close" onClick={() => apiRef.current?.deselect()} aria-label="Close">
          <Icon name="close" style={{ width: 15, height: 15 }} />
        </button>
        {node && (
          <>
            <span className="np-type">
              <i style={{ background: `var(--${node.type === 'project' ? 'orange' : node.type === 'post' ? 'honey' : node.type === 'skill' ? 'taupe' : 'sage'})` }} />
              {TYPE_META[node.type].label}
            </span>
            <h3>{node.label}</h3>
            <div className="np-desc">{node.desc}</div>
            <div className="np-sec">Connected to</div>
            <div className="np-rel">
              {related.map((j) => (
                <button key={j} onClick={() => apiRef.current?.select(j)}>
                  {DATA[j].label}
                </button>
              ))}
            </div>
            <button className="np-ask" onClick={() => ask(`Tell me about ${node.label}`)}>
              <svg viewBox="0 0 32 32" style={{ width: 17, height: 17 }}>
                <use href="#buzzy-mark" />
              </svg>
              Ask Buzzy about this
            </button>
          </>
        )}
      </aside>
    </>
  );
}
