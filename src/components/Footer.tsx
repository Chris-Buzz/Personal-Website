import { Link } from 'react-router-dom';
import { NAV, PROFILE } from '../data/content';
import { useBuzzy } from '../context/BuzzyContext';
import { Icon } from './IconSprite';

export default function Footer() {
  const { setOpen } = useBuzzy();
  return (
    <footer>
      <div className="ghost-word">BUZAID</div>
      <div className="wrap">
        <div className="foot-cta">
          <div className="kicker">Get in touch</div>
          <h2 className="display">
            Want to build something <em>together?</em>
          </h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email} <Icon name="arrow" />
            </a>
            <button className="btn btn-ghost" onClick={() => setOpen(true)}>
              Or just ask Digby
            </button>
          </div>
        </div>

        <div className="foot-grid">
          <div className="foot-col">
            <div className="fc-title">Colophon</div>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', maxWidth: '38ch' }}>
              Designed as one system: muted cream, professional orange, a serif with opinions, and a graph underneath
              everything. Honey &amp; Ink.
            </p>
          </div>
          <div className="foot-col">
            <div className="fc-title">Pages</div>
            {NAV.map((n) => (
              <div key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </div>
            ))}
          </div>
          <div className="foot-col">
            <div className="fc-title">Elsewhere</div>
            <div>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                <Icon name="github" /> GitHub
              </a>
            </div>
            <div>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                <Icon name="linkedin" /> LinkedIn
              </a>
            </div>
            <div>
              <a href={`mailto:${PROFILE.email}`}>
                <Icon name="mail" /> Email
              </a>
            </div>
          </div>
        </div>

        <div className="foot-base">
          <span>© {new Date().getFullYear()} Christopher Buzaid</span>
          <span>Cream · Orange · One graph</span>
        </div>
      </div>
    </footer>
  );
}
