import { NavLink, Link } from 'react-router-dom';
import { NAV, PROFILE } from '../data/content';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './IconSprite';
import { GuideButton } from './Guide';
import Scramble from './Scramble';

/** A floating pill for the pages and the guide, with theme and email in the corner. */
export default function Header() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <header className="site-head">
      <div className="wrap">
        <nav className="pill" aria-label="Primary">
          <Link to="/" className="pill-home" aria-label="Chris Buzaid, home">
            <Icon name="bee" />
          </Link>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="pill-item">
              <Icon name={n.icon} />
              <Scramble text={n.label} />
            </NavLink>
          ))}
          <GuideButton />
        </nav>
        <div className="corner">
          <button className="icon-btn theme-btn" onClick={toggle} aria-label={`Switch to ${next} theme`}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <a className="icon-btn" href={`mailto:${PROFILE.email}`} aria-label="Email Chris">
            <Icon name="mail" />
          </a>
        </div>
      </div>
    </header>
  );
}
