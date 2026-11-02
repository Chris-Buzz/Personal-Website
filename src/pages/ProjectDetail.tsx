import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Icon } from '../components/IconSprite';
import BrainDiagram from '../components/BrainDiagram';
import RecallResults from '../components/RecallResults';
import { useGuide } from '../context/GuideContext';
import { PROJECTS, type Evidence, type Project } from '../data/content';

function Section({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <section className="cs-section" aria-labelledby={id}>
      <div className="cs-label">
        <h2 className="label" id={id}>
          <span className="num">0{n}</span>
          <span>{label}</span>
        </h2>
      </div>
      <div className="cs-body">{children}</div>
    </section>
  );
}

function EvidenceBlock({ evidence }: { evidence: Evidence }) {
  if (evidence.kind === 'recall') return <RecallResults />;
  if (evidence.kind === 'stats') {
    return (
      <>
        <p className="cite">
          <em>{evidence.source.title}</em> {evidence.source.detail}
        </p>
        <div className="stats">
          {evidence.items.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="fine">{evidence.note}</p>
      </>
    );
  }
  return (
    <figure className="shot">
      <img src={evidence.src} alt={evidence.alt} width={evidence.width} height={evidence.height} loading="lazy" />
      <figcaption>
        <span className="fine">{evidence.caption}</span>
        <span className="label">In development</span>
      </figcaption>
    </figure>
  );
}

const evidenceLabel = (p: Project) =>
  p.evidence?.kind === 'recall' ? 'Measured' : p.evidence?.kind === 'stats' ? 'Results' : 'From the game';

/** /work/:slug, one case study per project, driven by PROJECTS data. */
export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const { ask } = useGuide();
  const [active, setActive] = useState<number | null>(null);

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) return <Navigate to="/work" replace />;
  const p = PROJECTS[idx];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const isBrain = p.slug === 'brain';

  let n = 0;
  return (
    <article>
      <header className="wrap cs-head">
        <Link to="/work" className="back label">
          <Icon name="arrow" /> All work
        </Link>
        <p className="cs-top">
          <span>{p.num}</span>
          <span className="status" data-tone={p.status.tone}>{p.status.label}</span>
          <span>{p.year}</span>
        </p>
        <h1>{p.title}</h1>
        <p className="cs-tagline">{p.tagline}</p>
        <dl className="cs-meta">
          {p.meta.map((m) => (
            <div key={m.k}>
              <dt className="label">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </dl>
        <div className="cs-actions">
          {p.links.map((l) => (
            <a key={l.href} className="btn btn-solid" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <Icon name="ext" />
            </a>
          ))}
          <button className="btn btn-line" onClick={() => ask(p.ask)}>
            Ask the guide about {p.title}
          </button>
          {p.note && <p className="cs-note">{p.note}</p>}
        </div>
      </header>

      <div className="wrap">
        <Section n={++n} label="The problem">
          <div className="prose">
            {p.problem.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </Section>

        <Section n={++n} label="How it works">
          {isBrain && <BrainDiagram active={active} onActive={setActive} />}
          <ol className="steps">
            {p.how.map((s, i) => (
              <li
                key={s.h}
                data-active={isBrain && active === i}
                onMouseEnter={isBrain ? () => setActive(i) : undefined}
                onMouseLeave={isBrain ? () => setActive(null) : undefined}
                onClick={isBrain ? () => setActive(active === i ? null : i) : undefined}
              >
                <span className="label num">0{i + 1}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </Section>

        {p.evidence && (
          <Section n={++n} label={evidenceLabel(p)}>
            <EvidenceBlock evidence={p.evidence} />
          </Section>
        )}

        <Section n={++n} label="Decisions">
          <ul className="decisions">
            {p.decisions.map((d) => (
              <li key={d.h}>
                <h3>{d.h}</h3>
                <p>{d.p}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section n={++n} label="Where it stands">
          <ul className="standing">
            {p.standing.map((s) => (
              <li key={s.item}>
                <span className="item">{s.item}</span>
                <span className="status" data-tone={s.tone}>{s.state}</span>
              </li>
            ))}
          </ul>
          <p className="legend" aria-hidden="true">
            <span className="status" data-tone="live">Done or live</span>
            <span className="status" data-tone="progress">In progress</span>
            <span className="status" data-tone="planned">Planned</span>
          </p>
        </Section>

        <Link className="cs-next" to={`/work/${next.slug}`}>
          <span className="label">Next project</span>
          <strong>
            {next.title}
            <Icon name="arrow" />
          </strong>
          <p>{next.tagline}</p>
        </Link>
      </div>
    </article>
  );
}
