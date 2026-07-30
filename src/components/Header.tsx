import { NavLink } from 'react-router-dom';
import { NAV } from '../data/content';
import { useTheme } from '../context/ThemeContext';
import { useBuzzy } from '../context/BuzzyContext';
import { Icon } from './IconSprite';
import DigbyFace from './DigbyFace';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { setOpen } = useBuzzy();

  return (
    <header className="site-head">
      <NavLink to="/" className="wordmark" end>
        <svg className="mark" viewBox="0 0 32 32">
          <use href="#buzzy-mark" />
        </svg>
        <span>CHRISTOPHER BUZAID</span>
      </NavLink>

      <nav className="head-nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="head-right">
        <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
        </button>
        <button className="buzzy-btn" onClick={() => setOpen(true)} aria-label="Open Digby" title="Digby">
          <DigbyFace size={30} animate="think" body="var(--bg)" />
        </button>
      </div>
    </header>
  );
}
