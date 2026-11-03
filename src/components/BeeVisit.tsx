import { useEffect, useRef, type RefObject } from 'react';

const SIZE = 26;
const FLY = 'cubic-bezier(0.45, 0.05, 0.2, 1)';
const POP = 'cubic-bezier(0.16, 1, 0.3, 1)';
// the load flight and the square's pop end at 2.02s (see DESIGN.md)
const READY_AFTER = 2100;
const HOME_AFTER = 800;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Point {
  x: number;
  y: number;
}

/**
 * After the load flight, the bee flies to whichever hero button or Now link the visitor hovers or tabs to, perches
 * on its top-right corner, and flies home to the orange square once the visitor moves on. Targets carry
 * `data-perch`; `data-perch="accent"` marks the orange Now panel, where the bee turns ink so it stays visible.
 * Touch taps and reduced motion get no visits. Positions are in the hero's coordinates, so scrolling never
 * separates the bee from its perch.
 */
export default function BeeVisit({ heroRef }: { heroRef: RefObject<HTMLElement> }) {
  const beeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bee = beeRef.current;
    const square = hero?.querySelector<HTMLElement>('.land-dot');
    if (!hero || !bee || !square) return;

    let ready = false;
    let away = false;
    let perched: Element | null = null;
    let byKeyboard = false;
    let flight: Animation | null = null;
    let squareAnim: Animation | null = null;
    let homeTimer = 0;
    let inkTimer = 0;

    const relative = (r: DOMRect): Point => {
      const h = hero.getBoundingClientRect();
      return { x: r.left - h.left, y: r.top - h.top };
    };
    const squarePoint = (): Point => {
      const r = square.getBoundingClientRect();
      const p = relative(r);
      return { x: p.x + r.width / 2, y: p.y + r.height / 2 };
    };
    const perchPoint = (el: Element): Point => {
      const r = el.getBoundingClientRect();
      const p = relative(r);
      return { x: p.x + r.width - 14, y: p.y - 2 };
    };
    // The bee's centre right now, perched or mid-flight. The computed transform is translate then rotate,
    // so the matrix's e and f are the translation.
    const current = (): Point => {
      const m = new DOMMatrix(getComputedStyle(bee).transform);
      return { x: m.e + SIZE / 2, y: m.f + SIZE / 2 };
    };
    const at = (p: Point, deg: number) => `translate(${p.x - SIZE / 2}px, ${p.y - SIZE / 2}px) rotate(${deg}deg)`;

    // Nine points on a curve that peaks about 40px above the higher end, tilting -8deg, 10deg at the top, then 0.
    const fly = (to: Point, duration: number, ink: boolean) => {
      const from = away ? current() : squarePoint();
      const c = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 80 };
      const frames = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const u = 1 - t;
        const p = {
          x: u * u * from.x + 2 * u * t * c.x + t * t * to.x,
          y: u * u * from.y + 2 * u * t * c.y + t * t * to.y,
        };
        return { transform: at(p, t < 0.5 ? -8 + 36 * t : 20 - 20 * t) };
      });
      flight?.cancel();
      flight = bee.animate(frames, { duration, easing: FLY, fill: 'forwards' });
      window.clearTimeout(inkTimer);
      inkTimer = window.setTimeout(() => bee.toggleAttribute('data-ink', ink), duration / 2);
      return flight;
    };

    const visit = (perch: Element, keyboard: boolean) => {
      if (!ready || reducedMotion() || perch === perched) return;
      window.clearTimeout(homeTimer);
      byKeyboard = keyboard;
      const ink = perch.getAttribute('data-perch') === 'accent';
      if (!away) {
        squareAnim?.cancel();
        squareAnim = square.animate([{ transform: 'scale(1)' }, { transform: 'scale(0)' }], {
          duration: 160,
          easing: 'ease-in',
          fill: 'forwards',
        });
        bee.style.opacity = '1';
      }
      fly(perchPoint(perch), away ? 400 : 550, ink);
      away = true;
      perched = perch;
    };

    const land = () => {
      flight?.cancel();
      bee.style.opacity = '0';
      bee.removeAttribute('data-ink');
      away = false;
      squareAnim?.cancel();
      squareAnim = square.animate(
        [{ transform: 'scale(0.2)' }, { transform: 'scale(1.25)', offset: 0.7 }, { transform: 'scale(1)' }],
        { duration: 520, easing: POP }
      );
    };

    const goHome = () => {
      if (!away) return;
      perched = null;
      fly(squarePoint(), 600, false).onfinish = land;
    };
    const homeSoon = () => {
      window.clearTimeout(homeTimer);
      homeTimer = window.setTimeout(goHome, HOME_AFTER);
    };

    // a layout change moves every perch, so the bee goes straight home without flying
    const reset = () => {
      window.clearTimeout(homeTimer);
      window.clearTimeout(inkTimer);
      if (!away) return;
      flight?.cancel();
      squareAnim?.cancel();
      bee.style.opacity = '0';
      bee.removeAttribute('data-ink');
      away = false;
      perched = null;
    };

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const perch = (e.target as Element).closest('[data-perch]');
      if (perch) visit(perch, false);
    };
    const onPointerEnter = () => window.clearTimeout(homeTimer);
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' && !byKeyboard) homeSoon();
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as Element;
      const perch = el.matches(':focus-visible') ? el.closest('[data-perch]') : null;
      if (perch) visit(perch, true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (byKeyboard && !hero.contains(e.relatedTarget as Node | null)) homeSoon();
    };

    const readyTimer = window.setTimeout(() => (ready = true), READY_AFTER);
    hero.addEventListener('pointerover', onPointerOver);
    hero.addEventListener('pointerenter', onPointerEnter);
    hero.addEventListener('pointerleave', onPointerLeave);
    hero.addEventListener('focusin', onFocusIn);
    hero.addEventListener('focusout', onFocusOut);
    window.addEventListener('resize', reset);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(homeTimer);
      window.clearTimeout(inkTimer);
      hero.removeEventListener('pointerover', onPointerOver);
      hero.removeEventListener('pointerenter', onPointerEnter);
      hero.removeEventListener('pointerleave', onPointerLeave);
      hero.removeEventListener('focusin', onFocusIn);
      hero.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('resize', reset);
      flight?.cancel();
      squareAnim?.cancel();
    };
  }, [heroRef]);

  return (
    <svg ref={beeRef} className="visit-bee" viewBox="0 0 32 32" aria-hidden="true">
      <use href="#i-bee" />
    </svg>
  );
}
