import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Photo from '../components/Photo';
import { PROFILE } from '../data/content';

/**
 * The home hero: opens on bare text, then a scroll-driven dive down a hexagon /
 * particle tunnel that blooms into light as it lands and hands off to the page
 * content below. Pure lines/points/sprites — no shadows, no PBR, no lights.
 * One scroll value `p` (0..1) drives camera + reveal + stages.
 *
 * All Three.js lives in the single effect below and is fully torn down on unmount.
 */
export default function HeroCinematic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const st0Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const dimEl = dimRef.current;
    const cueEl = cueRef.current;
    if (!canvas || !wrap || !dimEl || !cueEl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      canvas.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfaf6ee, 6, 54);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 220);

    function sprite() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, 'rgba(255,255,255,1)');
      rg.addColorStop(0.4, 'rgba(255,255,255,.5)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const dot = sprite();
    const ORANGE = 0xd9701e, BRIGHT = 0xe8862e, HONEY = 0xdfa251, TAUPE = 0xb0a188;
    const cols = [ORANGE, HONEY, TAUPE];
    const hexPts = (r: number) => {
      const a: THREE.Vector3[] = [];
      for (let k = 0; k <= 6; k++) {
        const ang = Math.PI / 6 + (k * Math.PI) / 3;
        a.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, 0));
      }
      return a;
    };
    const hexFrame = (r: number, color: number, op: number) =>
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(hexPts(r)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }));

    // TUNNEL — streaking particles down the throat
    const tunnelG = new THREE.Group();
    scene.add(tunnelG);
    const Z_NEAR = 4, Z_FAR = -70, pN = 850;
    const pGeo = new THREE.BufferGeometry();
    const pP = new Float32Array(pN * 3), pC = new Float32Array(pN * 3);
    const pal = [new THREE.Color(ORANGE), new THREE.Color(BRIGHT), new THREE.Color(HONEY), new THREE.Color(0xf3e8d2)];
    for (let i = 0; i < pN; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 0.7 + Math.pow(Math.random(), 0.55) * 6.0;
      pP[i * 3] = Math.cos(a) * rad;
      pP[i * 3 + 1] = Math.sin(a) * rad * 0.82;
      pP[i * 3 + 2] = Z_NEAR - Math.random() * (Z_NEAR - Z_FAR);
      const c = pal[(Math.random() * pal.length) | 0];
      pC[i * 3] = c.r; pC[i * 3 + 1] = c.g; pC[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pP, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pC, 3));
    const tunnelMat = new THREE.PointsMaterial({ map: dot, size: 0.15, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const tunnelPts = new THREE.Points(pGeo, tunnelMat);
    tunnelG.add(tunnelPts);

    // hexagon ring-gates receding down the tunnel
    const gates: THREE.Line[] = [];
    for (let i = 0; i < 14; i++) {
      const z = -1 - i * 4.6;
      const r = 2.3 + Math.sin(i * 1.3) * 0.55;
      const f = hexFrame(r, cols[i % 3], 0);
      f.position.set(0, 0, z);
      f.rotation.z = Math.random() * Math.PI;
      (f.userData as any).spin = (i % 2 ? 1 : -1) * (0.06 + Math.random() * 0.08);
      (f.userData as any).base = 0.55;
      tunnelG.add(f);
      gates.push(f);
    }

    // light at the end
    const endGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0xfff3de, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    endGlow.scale.set(9, 9, 1);
    endGlow.position.set(0, 0, Z_FAR + 6);
    tunnelG.add(endGlow);

    // camera path — a straight dive down the tunnel
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const K = [
      { p: 0.0, pos: V(0, 0, 12), look: V(0, 0, -6) },
      { p: 0.3, pos: V(0, 0, 2), look: V(0, 0, -16) },
      { p: 0.62, pos: V(0, 0, -22), look: V(0, 0, -44) },
      { p: 0.86, pos: V(0, 0, -46), look: V(0, 0, -66) },
      { p: 1.0, pos: V(0, 0, -60), look: V(0, 0, -74) },
    ];
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const cPos = new THREE.Vector3(), cLook = new THREE.Vector3();
    function sampleCam(p: number) {
      let a = K[0], b = K[K.length - 1];
      for (let i = 0; i < K.length - 1; i++) {
        if (p >= K[i].p && p <= K[i + 1].p) { a = K[i]; b = K[i + 1]; break; }
      }
      const t = smooth((p - a.p) / Math.max(1e-5, b.p - a.p));
      cPos.lerpVectors(a.pos, b.pos, t);
      cLook.lerpVectors(a.look, b.look, t);
    }

    // stages
    const stages = [
      { el: st0Ref.current!, from: -0.25, to: 0.13, base: 'translateY(-50%)' },
    ];
    const FADE = 0.035;
    const stageAlpha = (s: (typeof stages)[number], p: number) => {
      if (p < s.from || p > s.to) return 0;
      return Math.max(0, Math.min(Math.min(1, (p - s.from) / FADE), Math.min(1, (s.to - p) / FADE)));
    };

    let pRaw = 0, pSm = 0;
    const readScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      pRaw = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));
    };
    let mxN = 0, myN = 0, mxS = 0, myS = 0;
    const onMouse = (e: MouseEvent) => {
      mxN = (e.clientX / window.innerWidth - 0.5) * 2;
      myN = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduceMotion) {
      window.addEventListener('scroll', readScroll, { passive: true });
      readScroll();
      window.addEventListener('mousemove', onMouse);
    }

    let dimMax = 0.9;
    const applyTheme = (dark: boolean) => {
      scene.fog!.color.set(dark ? 0x181310 : 0xfaf6ee);
      dimEl.style.background = dark
        ? 'radial-gradient(ellipse at center,rgba(28,22,17,.5) 0%,rgba(20,15,11,.85) 60%,rgba(8,6,4,.95) 100%)'
        : 'radial-gradient(ellipse at center,rgba(255,253,248,.45) 0%,#FBF3E4 60%,rgba(247,228,205,.9) 100%)';
      dimMax = dark ? 0.85 : 0.9; // the dive ends in a full bloom that hands off to the page
    };
    window.__cineTheme = applyTheme;
    applyTheme(document.documentElement.dataset.theme === 'dark');

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const pw = Math.floor(w * renderer.getPixelRatio()), ph = Math.floor(h * renderer.getPixelRatio());
      if (w && h && (canvas.width !== pw || canvas.height !== ph)) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    let raf = 0, t = 0, lastT = performance.now();
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      resize();
      t += dt;
      // exponential smoothing normalized by dt — same crisp feel at any refresh rate
      pSm += (pRaw - pSm) * (1 - Math.exp(-9 * dt));
      const p = pSm;

      const reveal = smoothstep(0.0, 0.1, p);
      const land = smoothstep(0.8, 1.0, p);
      const vis = reveal * (1 - land);
      tunnelMat.opacity = 0.95 * vis;
      // the light at the end swells into the landing bloom
      (endGlow.material as THREE.SpriteMaterial).opacity = (0.2 + 0.55 * smoothstep(0.4, 0.85, p)) * reveal * (1 - land * 0.3) * (0.85 + 0.15 * Math.sin(t * 2.2));

      sampleCam(p);
      const mk = 1 - Math.exp(-6 * dt);
      mxS += (mxN - mxS) * mk;
      myS += (myN - myS) * mk;
      const sway = 0.28;
      camera.position.set(cPos.x + mxS * sway, cPos.y - myS * sway * 0.6, cPos.z);
      camera.lookAt(cLook);
      let fov = 48;
      if (p > 0.2 && p < 0.78) fov = 48 + 10 * Math.sin(((p - 0.2) / 0.58) * Math.PI);
      if (Math.abs(camera.fov - fov) > 0.1) { camera.fov += (fov - camera.fov) * 0.08; camera.updateProjectionMatrix(); }
      if (p > 0.18 && p < 0.82) {
        const rr = Math.min(1, (0.82 - p) / 0.08) * Math.min(1, (p - 0.18) / 0.08);
        camera.rotateZ(Math.sin((p - 0.18) * 5) * 0.05 * rr);
      }

      tunnelG.rotation.z = Math.sin(t * 0.15) * 0.12;
      // gates flash and swell as the camera punches through each one
      for (let i = 0; i < gates.length; i++) {
        const g = gates[i];
        g.rotation.z += (g.userData as any).spin * dt;
        const dz = camera.position.z - g.position.z;
        const flash = Math.exp(-dz * dz * 0.3);
        (g.material as THREE.LineBasicMaterial).opacity = Math.min(1, ((g.userData as any).base + flash * 0.9) * vis);
        g.scale.setScalar(1 + flash * 0.06);
      }

      dimEl.style.opacity = (land * dimMax).toFixed(3);

      stages.forEach((s) => {
        if (!s.el) return;
        const a = stageAlpha(s, p);
        s.el.style.opacity = a.toFixed(3);
        const mid = (s.from + s.to) / 2, half = (s.to - s.from) / 2;
        const drift = ((p - mid) / Math.max(1e-5, half)) * -18;
        s.el.style.transform = `${s.base} translateY(${drift.toFixed(1)}px)`;
      });
      cueEl.style.opacity = p < 0.04 ? '1' : '0';

      renderer.render(scene, camera);
    }
    let heroVisible = true;
    let io: IntersectionObserver | null = null;
    if (reduceMotion) {
      // Static hero: one composed frame, no dive, no listeners, no loop.
      raf = requestAnimationFrame(() => {
        resize();
        sampleCam(0);
        camera.position.copy(cPos);
        camera.lookAt(cLook);
        renderer.render(scene, camera);
      });
    } else {
      raf = requestAnimationFrame(frame);
      // Park the RAF loop entirely while the hero is scrolled out of view.
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !heroVisible) {
          heroVisible = true;
          lastT = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!e.isIntersecting && heroVisible) {
          heroVisible = false;
          cancelAnimationFrame(raf);
        }
      });
      io.observe(wrap);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('mousemove', onMouse);
      if (window.__cineTheme === applyTheme) delete window.__cineTheme;
      pGeo.dispose();
      tunnelMat.dispose();
      dot.dispose();
      gates.forEach((g) => { g.geometry.dispose(); (g.material as THREE.Material).dispose(); });
      renderer.dispose();
    };
  }, []);

  return (
    <div id="cine-wrap" ref={wrapRef}>
      <div id="cine-stick">
        <canvas id="cine-canvas" ref={canvasRef} />
        <div id="cine-dim" ref={dimRef} />
        <div className="cine-vignette" />
        <div className="cine-grain" />

        <div className="stage" id="st-0" ref={st0Ref}>
          <div className="hero-chip">
            <Photo src={PROFILE.photo} fallback={PROFILE.photoFallback} alt={PROFILE.name} />
            <span>
              <i />
              {PROFILE.availabilityChip}
            </span>
          </div>
          <div className="kicker">{PROFILE.name}</div>
          <h1>
            Hey — I'm Chris. <em>I build things.</em>
          </h1>
          <p>
            Computer Science at Monmouth, 3.9 GPA. I make AI products, run a fifty-person basketball club, and wire
            everything I build into one knowledge base you can actually talk to.
          </p>
        </div>

        <div className="scroll-cue" ref={cueRef}>
          <span>Scroll</span>
          <div className="line" />
        </div>
      </div>
    </div>
  );
}
