import { Link } from 'react-router-dom';
import { PROFILE } from '../data/content';
import { Icon } from './IconSprite';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme, toggle } = useTheme();
  return (
    <footer className="site-foot">
      <div className="wrap">
        <p className="label">Contact</p>
        <h2>
          Tell me what you need built<span>.</span>
        </h2>
        <a className="foot-mail" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
          <Icon name="arrow" />
        </a>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <nav aria-label="Elsewhere">
            <Link to="/work">Work</Link>
            <Link to="/about">About</Link>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <button onClick={toggle}>{theme === 'dark' ? 'Light' : 'Dark'} mode</button>
          </nav>
          <span>{PROFILE.location}</span>
        </div>
      </div>
    </footer>
  );
}
