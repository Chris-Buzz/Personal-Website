import { useEffect, useRef, useState } from 'react';

/**
 * DigbyFace — Digby the mole, ported from the Digby desktop app (DigbySvg)
 * and mapped onto this site's design tokens. Same hand-drawn editorial
 * character: blink, cursor-tracking pupils, ear twitch, nose sniff, blush,
 * and the catch-light that makes two dots read as a face.
 *
 * Poses: "portrait" (head), "full" (head+body+paws+tail), "peek" (head
 * emerging from a dirt mound). Animation: false | "float" | "think".
 * All motion is disabled under prefers-reduced-motion.
 */

type Pose = 'portrait' | 'full' | 'peek';
type AnimateMode = boolean | 'float' | 'think';

interface DigbyFaceProps {
  size?: number;
  animate?: AnimateMode;
  pose?: Pose;
  className?: string;
  /** stroke + eye color (default site ink) */
  ink?: string;
  /** fur color (default taupe; pass var(--bg) on orange surfaces) */
  body?: string;
  eyeTracking?: boolean;
  earTwitch?: boolean;
  noseSniff?: boolean;
  /** occasional happy closed-arc eyes */
  expressions?: boolean;
  /** a little paw that waves on mount and every so often */
  wave?: boolean;
}

const KEYFRAME_ID = 'digby-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined' || document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes digbyFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
    @keyframes digbyThink { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.03) translateY(-1px)} }
    @keyframes digbyBlink { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.05)} }
    @keyframes digbyEarTwitch { 0%{transform:rotate(0)} 40%{transform:rotate(-9deg)} 70%{transform:rotate(4deg)} 100%{transform:rotate(0)} }
    @keyframes digbySniff { 0%,100%{transform:scale(1)} 40%{transform:scale(0.82)} 70%{transform:scale(1.06)} }
    @keyframes digbyWave { 0%,100%{transform:rotate(0)} 30%{transform:rotate(-18deg)} 60%{transform:rotate(10deg)} }
  `;
  document.head.appendChild(style);
}

export default function DigbyFace({
  size = 32,
  animate = false,
  pose = 'portrait',
  className = '',
  ink = 'var(--ink)',
  body = 'var(--taupe)',
  eyeTracking = false,
  earTwitch = false,
  noseSniff = false,
  expressions = false,
  wave = false,
}: DigbyFaceProps) {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim: AnimateMode = reduce ? false : animate;
  const track = eyeTracking && !reduce;
  const twitchOn = earTwitch && !reduce;
  const sniffOn = noseSniff && !reduce;
  const exprOn = expressions && !reduce;
  const waveOn = wave && !reduce;

  const [blinkCadence] = useState(() => 3000 + Math.random() * 3000);
  const [blinkPhase, setBlinkPhase] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [twitchCount, setTwitchCount] = useState(0);
  const [sniffCount, setSniffCount] = useState(0);
  const [happy, setHappy] = useState(false);
  const [waveCount, setWaveCount] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastTwitchRef = useRef(0);
  const lastSniffRef = useRef(0);

  useEffect(() => {
    injectKeyframes();
  }, []);

  // Quiet "moments": a happy-eyes beat, sometimes with a single clean wave.
  // One greeting wave shortly after mount, then sparingly.
  useEffect(() => {
    if (!exprOn && !waveOn) return;
    const timers: number[] = [];
    const moment = (forceWave = false) => {
      const doWave = waveOn && (forceWave || Math.random() < 0.5);
      setHappy(true);
      if (doWave) setWaveCount((c) => c + 1);
      timers.push(window.setTimeout(() => setHappy(false), doWave ? 1400 : 1000));
    };
    if (waveOn) timers.push(window.setTimeout(() => moment(true), 900));
    const id = window.setInterval(() => moment(), 12000 + Math.random() * 6000);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [exprOn, waveOn]);

  useEffect(() => {
    if (!anim) return;
    const id = setInterval(() => setBlinkPhase((p) => !p), blinkCadence);
    return () => clearInterval(id);
  }, [anim, blinkCadence]);

  // eyeTracking / earTwitch / noseSniff share one rAF-throttled mousemove
  useEffect(() => {
    if (!track && !twitchOn && !sniffOn) return;
    let rafPending = false;
    let lastEvent: MouseEvent | null = null;
    const apply = () => {
      rafPending = false;
      const ev = lastEvent;
      const node = svgRef.current;
      if (!ev || !node) return;
      const rect = node.getBoundingClientRect();
      const dx = ev.clientX - (rect.left + rect.width / 2);
      const dy = ev.clientY - (rect.top + rect.height * 0.4);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (track) setPupilOffset({ x: (dx / dist) * 0.7, y: (dy / dist) * 0.7 });
      if (dist < Math.max(rect.width, rect.height) * 2.5) {
        const now = Date.now();
        if (twitchOn && now - lastTwitchRef.current > 3500 + Math.random() * 4500) {
          lastTwitchRef.current = now;
          setTwitchCount((c) => c + 1);
        }
        if (sniffOn && now - lastSniffRef.current > 2200 + Math.random() * 3000) {
          lastSniffRef.current = now;
          setSniffCount((c) => c + 1);
        }
      }
    };
    const onMove = (ev: MouseEvent) => {
      lastEvent = ev;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [track, twitchOn, sniffOn]);

  const geom: Record<Pose, { viewBox: string; ratio: number }> = {
    portrait: { viewBox: '-4 -2 56 46', ratio: 46 / 56 },
    full: { viewBox: '-4 -2 56 78', ratio: 78 / 56 },
    peek: { viewBox: '-6 -4 60 36', ratio: 36 / 60 },
  };
  const { viewBox, ratio } = geom[pose];

  const bodyAnim =
    anim === 'float' || anim === true
      ? 'digbyFloat 3s ease-in-out infinite'
      : anim === 'think'
        ? 'digbyThink 4s ease-in-out infinite'
        : undefined;


  return (
    <svg
      ref={svgRef}
      width={size}
      height={Math.round(size * ratio)}
      viewBox={viewBox}
      fill="none"
      className={className}
      style={bodyAnim ? { animation: bodyAnim, transformOrigin: 'center', transformBox: 'fill-box' } : undefined}
      aria-label="Digby the mole"
      role="img"
    >
      {pose === 'full' && (
        <g>
          <path d="M44 56 Q52 54 50 64" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="24" cy="58" rx="22" ry="16" stroke={ink} strokeWidth="2" fill={body} />
          <ellipse cx="11" cy="66" rx="5" ry="3.5" stroke={ink} strokeWidth="2" fill={body} />
          <ellipse cx="37" cy="66" rx="5" ry="3.5" stroke={ink} strokeWidth="2" fill={body} />
          <g stroke={ink} strokeWidth="1.2" strokeLinecap="round">
            <line x1="8" y1="68.5" x2="8" y2="70.5" />
            <line x1="11" y1="69.5" x2="11" y2="71.5" />
            <line x1="14" y1="68.5" x2="14" y2="70.5" />
            <line x1="34" y1="68.5" x2="34" y2="70.5" />
            <line x1="37" y1="69.5" x2="37" y2="71.5" />
            <line x1="40" y1="68.5" x2="40" y2="70.5" />
          </g>
        </g>
      )}

      {pose === 'peek' && (
        <g>
          <path
            d="M-6 24 Q4 18 14 22 Q24 14 34 22 Q44 18 54 24 L54 28 L-6 28 Z"
            fill="color-mix(in srgb, var(--ink-3) 20%, transparent)"
            stroke={ink}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <g fill={ink} opacity="0.4">
            <circle cx="2" cy="22" r="0.7" />
            <circle cx="46" cy="20" r="0.8" />
            <circle cx="20" cy="18" r="0.6" />
          </g>
        </g>
      )}

      {/* Head */}
      <path d="M4 40 L4 20 Q4 4 24 4 Q44 4 44 20 L44 40" stroke={ink} strokeWidth="2" fill={body} />

      {/* Ears — pivots at their bases so twitches rotate naturally */}
      <g
        style={{
          transformOrigin: '12px 12px',
          transformBox: 'view-box',
          animation: twitchOn && twitchCount > 0 ? `digbyEarTwitch 320ms ease-out ${twitchCount}` : undefined,
        }}
      >
        <path d="M8 12 L8 4 Q8 0 12 0 Q16 0 16 4 L16 10" stroke={ink} strokeWidth="2" fill={body} />
      </g>
      <g
        style={{
          transformOrigin: '36px 12px',
          transformBox: 'view-box',
          animation: twitchOn && twitchCount > 0 ? `digbyEarTwitch 320ms ease-out 60ms ${twitchCount}` : undefined,
        }}
      >
        <path d="M32 10 L32 4 Q32 0 36 0 Q40 0 40 4 L40 12" stroke={ink} strokeWidth="2" fill={body} />
      </g>

      {/* Eyes — pupil + catch-light, or happy closed arcs during a "moment" */}
      {[16, 32].map((eyeCx) => {
        if (happy) {
          return (
            <path
              key={eyeCx}
              d={`M ${eyeCx - 3.2} 23.4 Q ${eyeCx} 19.4 ${eyeCx + 3.2} 23.4`}
              stroke={ink}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          );
        }
        const px = eyeCx + (track ? pupilOffset.x : 0);
        const py = 22 + (track ? pupilOffset.y : 0);
        return (
          <g
            key={eyeCx}
            style={
              anim
                ? {
                    animation: 'digbyBlink 180ms ease-in-out',
                    animationPlayState: blinkPhase ? 'running' : 'paused',
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                  }
                : undefined
            }
          >
            <ellipse cx={px} cy={py} rx="3" ry="3" fill={ink} />
          </g>
        );
      })}

      {/* Nose */}
      <g
        style={
          sniffOn && sniffCount > 0
            ? { animation: `digbySniff 380ms ease-out ${sniffCount}`, transformOrigin: '24px 30px', transformBox: 'view-box' }
            : undefined
        }
      >
        <ellipse cx="24" cy="30" rx="4" ry="3" stroke={ink} strokeWidth="2" fill="none" />
      </g>

      {/* Waving paw — keyed remount replays the wave once per trigger */}
      {waveOn && waveCount > 0 && (
        <g
          key={waveCount}
          style={{ animation: 'digbyWave 1.3s ease-in-out', transformOrigin: '45px 41px', transformBox: 'view-box' }}
        >
          <ellipse cx="45.5" cy="35.5" rx="4" ry="5" stroke={ink} strokeWidth="2" fill={body} transform="rotate(-14 45.5 35.5)" />
          <g stroke={ink} strokeWidth="1.1" strokeLinecap="round">
            <line x1="43.4" y1="31.6" x2="42.9" y2="29.9" />
            <line x1="45.7" y1="31" x2="45.6" y2="29.2" />
            <line x1="47.9" y1="31.6" x2="48.5" y2="30" />
          </g>
        </g>
      )}

      {/* Whiskers on the expressive poses */}
      {(pose === 'full' || pose === 'peek') && (
        <g stroke={ink} strokeWidth="0.9" strokeLinecap="round" opacity="0.7">
          <line x1="6" y1="29" x2="0" y2="27" />
          <line x1="6" y1="31" x2="-1" y2="31" />
          <line x1="6" y1="33" x2="0" y2="35" />
          <line x1="42" y1="29" x2="48" y2="27" />
          <line x1="42" y1="31" x2="49" y2="31" />
          <line x1="42" y1="33" x2="48" y2="35" />
        </g>
      )}
    </svg>
  );
}
