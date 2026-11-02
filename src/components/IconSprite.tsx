// Inline SVG <symbol> sprite, rendered once at the app root.
// Use a symbol anywhere with the <Icon name="arrow" /> helper.

export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12H19M13.5 6.5L19 12l-5.5 5.5" /></symbol>
        <symbol id="i-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 6.5h8v8M17.5 6.5l-11 11" /></symbol>
        <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><circle cx="12" cy="12" r="3.6" /><path d="M12 3.5V5M12 19v1.5M3.5 12H5M19 12h1.5M6 6l1.05 1.05M16.95 16.95L18 18M6 18l1.05-1.05M16.95 7.05L18 6" /></symbol>
        <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.4 6.4 0 0 0 9.2 9.2z" /></symbol>
        <symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 3.5L10.2 13.8M20.5 3.5l-6.6 17-3.7-7.3L3 9.5l17.5-6z" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7.5L12 13l7.5-5.5" /></symbol>
        <symbol id="i-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /></symbol>
        <symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></symbol>
        {/* Buzz, the bee: the home button and the mark that lands as the period after the name */}
        <symbol id="i-bee" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="8.4" rx="4.5" ry="2.9" transform="rotate(-26 10 8.4)" /><ellipse cx="22" cy="8.4" rx="4.5" ry="2.9" transform="rotate(26 22 8.4)" /><path d="M16 11.5L21.8 14.8V23.2L16 26.5L10.2 23.2V14.8L16 11.5Z" /><path d="M11.7 17.5H20.3" /><path d="M12.6 21.2H19.4" /></symbol>
        <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z" /></symbol>
      </defs>
    </svg>
  );
}

export function Icon({ name, className = '', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`ic ic-${name} ${className}`.trim()} style={style} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
