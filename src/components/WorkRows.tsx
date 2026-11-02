import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/content';
import { Icon } from './IconSprite';
import Peek from './Peek';

/** One row per project: title, one line, status, and the figure that best proves it. On hover, two evidence cards fan out. */
export default function WorkRows({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <ul className="rows">
      {PROJECTS.map((p) => (
        <li key={p.slug}>
          <Link className="row" to={`/work/${p.slug}`}>
            <Peek slug={p.slug} />
            <div className="row-main">
              <H className="row-title">
                {p.title}
                <Icon name="arrow" />
              </H>
              <p className="row-summary">{p.summary}</p>
              <p className="row-meta">
                <span className="status" data-tone={p.status.tone}>{p.status.label}</span>
                <span>{p.year}</span>
                <span>{p.tags.join(' · ')}</span>
              </p>
            </div>
            <p className="row-figure" data-plan={!!p.figure.plan}>
              {p.figure.plan && <span className="label">{p.figure.plan}</span>}
              <strong>{p.figure.value}</strong>
              <span>{p.figure.label}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
