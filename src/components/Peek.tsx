import { PAPER, RECALL, projectBySlug } from '../data/content';

// Two small cards that fan out of a work row on hover, built only from each project's real data.
// No mock screenshots: where a project has no real image, the cards show its numbers or plan as type.

function BrainCards() {
  return (
    <>
      <div className="peek-card a">
        <span className="label">Recall, hit in the top 4</span>
        <div className="peek-bars">
          {RECALL.rows.map((r) => (
            <div key={r.name}>
              <span>{r.name.replace(' only', '').replace('Hybrid plus graph', '+ graph')}</span>
              <i data-chosen={!!r.chosen} style={{ width: `${r.hit}%` }} />
              <span>{r.hit}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="peek-card b">
        <span className="label">Runs on my PC</span>
        <ol className="peek-list peek-boundary">
          {['Collect', 'Guard', 'Store', 'Index', 'Recall', 'Deliver'].map((s, i) => (
            <li key={s}>
              <span>0{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function LearnAICards() {
  return (
    <>
      <div className="peek-card a peek-paper">
        <span className="label">{PAPER.venue}</span>
        <b>{PAPER.title}</b>
        <span>{PAPER.authors}</span>
        <span>{PAPER.id}</span>
      </div>
      <div className="peek-card b">
        <span className="label">From the paper</span>
        <span className="peek-big">293</span>
        <span>students reached by class visits in 18 courses across five disciplines</span>
      </div>
    </>
  );
}

function BuzzOffCards() {
  const p = projectBySlug('buzzoff');
  const image = p?.evidence?.kind === 'image' ? p.evidence : null;
  return (
    <>
      {image && (
        <div className="peek-card a photo">
          <img src={image.src} alt="" loading="lazy" />
        </div>
      )}
      <div className="peek-card b">
        <span className="label">Game night</span>
        <ul className="peek-list">
          {p?.standing.slice(0, 4).map((s) => (
            <li key={s.item}>
              <span className="status" data-tone={s.tone} />
              <span>{s.item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function PlannoCards() {
  return (
    <>
      <div className="peek-card a">
        <span className="label">Three tiers of AI</span>
        <ol className="peek-list">
          <li>
            <span>01</span>
            <span>Apple on-device model</span>
          </li>
          <li>
            <span>02</span>
            <span>Claude Haiku, your own key</span>
          </li>
          <li>
            <span>03</span>
            <span>Plain rules, no model</span>
          </li>
        </ol>
      </div>
      <div className="peek-card b">
        <span className="label">Target</span>
        <span className="peek-big">4</span>
        <span>mornings of real use in one week, by December 14, 2026</span>
      </div>
    </>
  );
}

const CARDS: Record<string, () => JSX.Element> = {
  'common-memory': BrainCards,
  learnai: LearnAICards,
  buzzoff: BuzzOffCards,
  planno: PlannoCards,
};

export default function Peek({ slug }: { slug: string }) {
  const Cards = CARDS[slug];
  if (!Cards) return null;
  return (
    <div className="peek" aria-hidden="true">
      <Cards />
    </div>
  );
}
