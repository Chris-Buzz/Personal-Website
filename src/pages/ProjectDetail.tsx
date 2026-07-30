import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import ProjectShot from '../components/ProjectShot';
import HexField from '../three/HexField';
import { Icon } from '../components/IconSprite';
import { useBuzzy } from '../context/BuzzyContext';
import { CASE_STUDIES, PROJECTS } from '../data/content';
import { PROJECT_SHOTS } from '../lib/shots';

/** /work/:slug — one case study per project, driven by CASE_STUDIES data. */
export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const { ask } = useBuzzy();

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[idx];
  const cs = CASE_STUDIES[slug];
  if (!project || !cs) return <Navigate to="/work" replace />;

  const shots = PROJECT_SHOTS[slug] ?? [];
  const prev = PROJECTS[(idx + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const hrefLinks = project.links.filter((l) => l.href);

  return (
    <div className="page" id="page-project">
      {/* ── cinematic header with ambient 3D field ─────────────────────── */}
      <header className="pd-hero">
        <HexField seed={slug} className="pd-scene" />
        <div className="pd-hero-veil" />
        <div className="wrap pd-hero-inner">
          <Link to="/work" className="text-link muted pd-back">
            <Icon name="arrow" style={{ transform: 'rotate(180deg)' }} /> All work
          </Link>
          <div className="w-top pd-top">
            <span className="w-num">{project.num}</span>
            <span className={`badge${project.badgeLive ? ' live' : ''}`}>{project.badge}</span>
            <span className="w-date">{project.date}</span>
          </div>
          <h1 className="display">{project.title}</h1>
          <p className="lede">{cs.tagline}</p>
          <div className="w-tags">
            {project.tags.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
          <div className="pd-ctas">
            {hrefLinks.map((l) => {
              const external = l.href!.startsWith('http');
              const primary = /live|demo/i.test(l.label);
              return (
                <a
                  key={l.label}
                  className={`btn ${primary ? 'btn-primary' : 'btn-ghost'}`}
                  href={l.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {l.label} <Icon name={l.icon} className="ic" />
                </a>
              );
            })}
            <button className="btn btn-ghost" onClick={() => ask(cs.ask)}>
              Ask Digby about it <Icon name="spark" className="ic" />
            </button>
          </div>
        </div>
      </header>

      {/* ── overview + rail ────────────────────────────────────────────── */}
      <div className="wrap pd-grid">
        <div className="pd-main">
          <Reveal as="section" className="pd-sec">
            <div className="kicker">Overview</div>
            {cs.overview.map((para, i) => (
              <p className="pd-para" key={i}>{para}</p>
            ))}
          </Reveal>

          <Reveal as="section" className="pd-sec">
            <div className="kicker">What it does</div>
            <div className="pd-highlights">
              {cs.highlights.map((h) => (
                <div className="pd-hl" key={h.h}>
                  <h3>{h.h}</h3>
                  <p>{h.p}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="pd-sec">
            <div className="kicker">The story</div>
            <div className="story-list pd-story">
              {cs.story.map((b, i) => (
                <article className="story-item" key={b.k}>
                  <span className="si-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="si-body">
                    <div className="si-k">{b.k}</div>
                    <h3>{b.h}</h3>
                    <p>{b.p}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>

        <aside className="pd-rail">
          <div className="rail-card">
            <div className="rail-title">At a glance</div>
            {cs.facts.map((f) => (
              <div className="fact" key={f.k}>
                <span className="f-k">{f.k}</span>
                <span className="f-v">{f.v}</span>
              </div>
            ))}
          </div>
          <div className="rail-card">
            <div className="rail-title">Stack</div>
            {cs.stack.map((s) => (
              <div className="fact" key={s.k}>
                <span className="f-k">{s.k}</span>
                <span className="f-v">{s.v}</span>
              </div>
            ))}
          </div>
          <button className="np-ask" onClick={() => ask(cs.ask)}>
            <Icon name="spark" /> Ask Digby about {project.title}
          </button>
        </aside>
      </div>

      {/* ── gallery: real screenshots when present, concept mock until ── */}
      <section className="wrap pd-gallery">
        <Reveal className="next-head">
          <h2>Screenshots</h2>
          <p>{shots.length ? 'FROM THE APP' : 'CONCEPT PREVIEW — REAL ONES COMING'}</p>
        </Reveal>
        {shots.length ? (
          <div className="pd-shots">
            {shots.map((s) => (
              <Reveal as="figure" className="pd-shot" key={s.url}>
                <img src={s.url} alt={`${project.title} — ${s.caption || 'screenshot'}`} loading="lazy" />
                {s.caption && <figcaption>{s.caption}</figcaption>}
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="pd-mockwrap">
            <ProjectShot kind={project.shot} />
          </Reveal>
        )}
      </section>

      {/* ── prev / next ────────────────────────────────────────────────── */}
      <nav className="wrap pd-nav" aria-label="More projects">
        <Link to={`/work/${prev.slug}`} className="pd-nav-card">
          <span className="pdn-k"><Icon name="arrow" style={{ transform: 'rotate(180deg)' }} /> Previous</span>
          <h3>{prev.title}</h3>
          <p>{CASE_STUDIES[prev.slug]?.tagline}</p>
        </Link>
        <Link to={`/work/${next.slug}`} className="pd-nav-card pdn-next">
          <span className="pdn-k">Next <Icon name="arrow" /></span>
          <h3>{next.title}</h3>
          <p>{CASE_STUDIES[next.slug]?.tagline}</p>
        </Link>
      </nav>
    </div>
  );
}
