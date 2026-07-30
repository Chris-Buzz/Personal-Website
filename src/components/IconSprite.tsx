// Inline SVG <symbol> sprite, rendered once at the app root.
// Reference a symbol anywhere with: <svg className="ic"><use href="#i-arrow" /></svg>
// or via the <Icon name="arrow" /> helper.

export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {/* Buzzy logo mark — bee in flight */}
        <symbol id="buzzy-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="10" cy="8.4" rx="4.5" ry="2.9" transform="rotate(-26 10 8.4)" />
          <ellipse cx="22" cy="8.4" rx="4.5" ry="2.9" transform="rotate(26 22 8.4)" />
          <path d="M16 11.5L21.8 14.8V23.2L16 26.5L10.2 23.2V14.8L16 11.5Z" />
          <path d="M11.7 17.5H20.3" />
          <path d="M12.6 21.2H19.4" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12H19M13.5 6.5L19 12l-5.5 5.5" /></symbol>
        <symbol id="i-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 6.5h8v8M17.5 6.5l-11 11" /></symbol>
        <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><circle cx="12" cy="12" r="3.6" /><path d="M12 3.5V5M12 19v1.5M3.5 12H5M19 12h1.5M6 6l1.05 1.05M16.95 16.95L18 18M6 18l1.05-1.05M16.95 7.05L18 6" /></symbol>
        <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.4 6.4 0 0 0 9.2 9.2z" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><circle cx="11" cy="11" r="6.25" /><path d="M15.7 15.7l4.8 4.8" /></symbol>
        <symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 3.5L10.2 13.8M20.5 3.5l-6.6 17-3.7-7.3L3 9.5l17.5-6z" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7.5L12 13l7.5-5.5" /></symbol>
        <symbol id="i-hex" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round"><path d="M12 2.8L19.9 7.4v9.2L12 21.2l-7.9-4.6V7.4L12 2.8z" /></symbol>
        <symbol id="i-spark" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 3.2l2 5.8 5.8 2-5.8 2-2 5.8-2-5.8-5.8-2 5.8-2 2-5.8z" /></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M9 9.5h6M9 13h6M9 16.5h3.5" /></symbol>
        <symbol id="i-github" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.73.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></symbol>
        <symbol id="i-linkedin" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14.5H.22V8zm7.34 0h4.37v1.98h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99v7.89h-4.56v-7c0-1.67-.03-3.81-2.32-3.81-2.32 0-2.68 1.81-2.68 3.69v7.12H7.56V8z" /></symbol>
      </defs>
    </svg>
  );
}

/** Small helper: <Icon name="arrow" /> -> <svg class="ic"><use href="#i-arrow"/></svg> */
export function Icon({ name, className = 'ic', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** The Buzzy bee mark at an arbitrary size. */
export function BuzzyMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden="true">
      <use href="#buzzy-mark" />
    </svg>
  );
}
