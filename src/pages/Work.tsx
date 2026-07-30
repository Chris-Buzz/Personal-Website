import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Reveal from '../components/Reveal';
import ProjectShot from '../components/ProjectShot';
import { Icon } from '../components/IconSprite';
import { useBuzzy } from '../context/BuzzyContext';
import { PROJECTS, type Project } from '../data/content';

function WorkLinks({ project }: { project: Project }) {
  const { ask } = useBuzzy();
  return (
    <div className="w-links">
      <Link className="text-link" to={`/work/${project.slug}`}>
        Case study <Icon name="arrow" />
      </Link>
      {project.links.map((l, i) => {
        const inner = (
          <>
            {l.label} <Icon name={l.icon} />
          </>
        );
        const cls = `text-link${l.muted ? ' muted' : ''}`;
        if (l.ask) return <button key={i} className={cls} onClick={() => ask(l.ask!)}>{inner}</button>;
        const external = l.href?.startsWith('http');
        return (
          <a key={i} className={cls} href={l.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}

export default function Work() {
  const location = useLocation();

  // /work?p=<slug> — legacy deep links scroll to that project (kept for
  // back-compat; new links go straight to /work/<slug> case studies).
  useEffect(() => {
    const slug = new URLSearchParams(location.search).get('p');
    if (!slug) return;
    const t = setTimeout(() => {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 1800);
      }
    }, 80);
    return () => clearTimeout(t);
  }, [location.search]);

  return (
    <div className="page" id="page-work">
      <div className="wrap">
        <div className="page-hero">
          <div className="kicker">Selected work</div>
          <h1 className="display">
            Things I've <em>shipped.</em>
          </h1>
          <p className="lede">Real builds, indexed into the Hive. Every one opens into a full case study — and Digby can walk you through any of them.</p>
        </div>

        <div className="work-list">
          {PROJECTS.map((p) => (
            <Reveal as="article" className="work-row" key={p.num} id={p.slug}>
              <div className="work-info">
                <div className="w-top">
                  <span className="w-num">{p.num}</span>
                  <span className={`badge${p.badgeLive ? ' live' : ''}`}>{p.badge}</span>
                  <span className="w-date">{p.date}</span>
                </div>
                <h3>
                  <Link to={`/work/${p.slug}`} className="w-title-link">{p.title}</Link>
                </h3>
                <p className="w-desc">{p.desc}</p>
                <div className="w-tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
                <WorkLinks project={p} />
              </div>
              {/* redundant with the title link — skip it in tab order */}
              <Link to={`/work/${p.slug}`} className="shot-link" tabIndex={-1} aria-hidden="true">
                <ProjectShot kind={p.shot} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
