import { RefObject, useEffect, useRef } from 'react';

/**
 * Returns a ref holding the 0..1 progress of `target` scrolling through the
 * viewport (0 when its top hits the top of the viewport, 1 when its bottom
 * leaves). Read it inside a rAF loop — it does not trigger re-renders, which is
 * exactly what the canvas-driven scenes want.
 *
 * Currently the hero reads scroll directly inside its Three.js loop; this hook
 * is provided for any future scroll-driven section that prefers a shared util.
 */
export function useScrollProgress(target: RefObject<HTMLElement>) {
  const progress = useRef(0);
  useEffect(() => {
    const read = () => {
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      progress.current = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [target]);
  return progress;
}
