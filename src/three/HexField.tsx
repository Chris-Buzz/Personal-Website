import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HexField — a cheap ambient 3D backdrop for case-study headers: floating
 * wireframe hexagons + drifting motes in the site's palette, seeded per
 * project slug so every page gets its own arrangement.
 *
 * Budget rules (per CLAUDE.md): one RAF, ~20 line loops + 1 points cloud,
 * DPR capped at 1.5, no shadows/PBR. Pauses when scrolled out of view,
 * renders a single static frame under prefers-reduced-motion, repaints on
 * theme toggle, and disposes everything on unmount.
 */

/* fnv-1a hash → mulberry32: deterministic per-slug randomness */
function rng(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function HexField({ seed, className }: { seed: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const host = canvas.parentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = rng(seed);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
    camera.position.z = 15;

    const group = new THREE.Group();
    scene.add(group);

    // shared flat-top hex outline geometry
    const hexPts: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      hexPts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    }
    const hexGeo = new THREE.BufferGeometry().setFromPoints(hexPts);

    const matAccent = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 });
    const matQuiet = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 });

    interface Ring { obj: THREE.LineLoop; spd: number; phase: number; baseY: number }
    const rings: Ring[] = [];
    for (let i = 0; i < 20; i++) {
      const accent = rand() < 0.3;
      const ring = new THREE.LineLoop(hexGeo, accent ? matAccent : matQuiet);
      ring.position.set((rand() - 0.5) * 26, (rand() - 0.5) * 10, -9 + rand() * 13);
      ring.rotation.z = rand() * Math.PI;
      const s = 0.5 + rand() * 2.2;
      ring.scale.setScalar(s);
      rings.push({ obj: ring, spd: (rand() - 0.5) * 0.24, phase: rand() * Math.PI * 2, baseY: ring.position.y });
      group.add(ring);
    }

    // round mote texture (tiny canvas radial dot)
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = dotCanvas.height = 32;
    const dctx = dotCanvas.getContext('2d')!;
    const grad = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, 32, 32);
    const dotTex = new THREE.CanvasTexture(dotCanvas);

    const N_PTS = 80;
    const ptsPos = new Float32Array(N_PTS * 3);
    for (let i = 0; i < N_PTS; i++) {
      ptsPos[i * 3] = (rand() - 0.5) * 28;
      ptsPos[i * 3 + 1] = (rand() - 0.5) * 12;
      ptsPos[i * 3 + 2] = -9 + rand() * 13;
    }
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPos, 3));
    const ptsMat = new THREE.PointsMaterial({
      size: 0.14,
      map: dotTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(ptsGeo, ptsMat));

    scene.fog = new THREE.Fog(0xffffff, 12, 30);

    const paint = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      matAccent.color.set(new THREE.Color(cssVar('--orange') || '#D9701E'));
      matQuiet.color.set(new THREE.Color(cssVar(dark ? '--ink-3' : '--line') || '#E6DBC5'));
      ptsMat.color.set(new THREE.Color(cssVar('--honey') || '#DFA251'));
      // additive glow reads beautifully on dark; on cream it only washes out
      const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      matAccent.blending = blend;
      matQuiet.blending = THREE.NormalBlending;
      ptsMat.blending = blend;
      (scene.fog as THREE.Fog).color.set(new THREE.Color(cssVar('--bg') || '#FAF6EE'));
      matAccent.needsUpdate = matQuiet.needsUpdate = ptsMat.needsUpdate = true;
    };
    paint();

    const size = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();

    // smoothed mouse parallax
    let mx = 0, my = 0, mxS = 0, myS = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf: number | null = null;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      const k = 1 - Math.exp(-6 * dt); // frame-rate-independent easing
      mxS += (mx - mxS) * k;
      myS += (my - myS) * k;
      group.rotation.y = mxS * 0.1;
      group.rotation.x = -myS * 0.06;
      for (const r of rings) {
        r.obj.rotation.z += r.spd * dt;
        r.obj.position.y = r.baseY + Math.sin(t * 0.4 + r.phase) * 0.35;
      }
      renderer.render(scene, camera);
    };
    const start = () => {
      if (raf == null && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    // static single frame for reduced motion; otherwise run while visible
    renderer.render(scene, camera);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 });
    io.observe(host);

    const ro = new ResizeObserver(() => {
      size();
      if (raf == null) renderer.render(scene, camera);
    });
    ro.observe(host);

    // live theme repaint (ThemeContext flips data-theme on <html>)
    const mo = new MutationObserver(() => {
      paint();
      if (raf == null) renderer.render(scene, camera);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('mousemove', onMove);
      hexGeo.dispose();
      ptsGeo.dispose();
      matAccent.dispose();
      matQuiet.dispose();
      ptsMat.dispose();
      dotTex.dispose();
      renderer.dispose();
    };
  }, [seed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
