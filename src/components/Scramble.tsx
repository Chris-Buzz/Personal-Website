import { useCallback, useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+*#';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Resolves text left to right out of random glyphs. Meant for Geist Mono, where every glyph has the same width. */
export function useScramble(text: string, duration = 520) {
  const [out, setOut] = useState(text);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (reducedMotion()) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      setOut(
        Array.from(text, (c, i) => (i < settled || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('')
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    setOut(text);
    return () => cancelAnimationFrame(frame.current);
  }, [text]);

  return [out, run] as const;
}

/** Text that scrambles into place on hover, or once on mount. Screen readers get the plain text. */
export default function Scramble({ text, onMount = false, duration }: { text: string; onMount?: boolean; duration?: number }) {
  const [out, run] = useScramble(text, duration);
  useEffect(() => {
    if (onMount) run();
  }, [onMount, run]);
  return (
    <span className="scramble" onMouseEnter={onMount ? undefined : run}>
      <span aria-hidden="true">{out}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
