import { Link } from 'react-router-dom';
import { useGuide } from '../context/GuideContext';
import { Icon } from '../components/IconSprite';
import WorkRows from '../components/WorkRows';
import { CONTEXT, HERO, NOW, PRINCIPLES, PROFILE } from '../data/content';

export default function Home() {
  const { ask } = useGuide();
  return (
    <>
      <div className="wrap">
        <section className="hero" aria-labelledby="hero-name">
          <div className="hero-main">
            <p className="label">{HERO.eyebrow}</p>
            <h1 className="name" id="hero-name">
              <span className="name-line">
                <span>Chris</span>
              </span>
              <span className="name-row">
                <span className="name-line">
                  <span>Buzaid</span>
                </span>
                <span className="land" aria-hidden="true">
                  <span className="land-dot" />
                  <span className="land-bee">
                    <svg viewBox="0 0 32 32">
                      <use href="#i-bee" />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>
            <p className="hero-lead">{HERO.lead}</p>
            <p className="hero-detail">{HERO.detail}</p>
            <div className="hero-actions">
              <Link className="btn btn-solid" to="/work">
                See the work <Icon name="arrow" />
              </Link>
              <button className="btn btn-line" onClick={() => ask('What should I look at first?')}>
                <Icon name="chat" /> Ask the guide
              </button>
              <a className="btn btn-line" href={`mailto:${PROFILE.email}`}>
                Email me
              </a>
            </div>
          </div>

          <aside className="now" aria-labelledby="now-title">
            <div className="now-head">
              <h2 id="now-title">Now</h2>
              <span>{NOW.when}</span>
            </div>
            {NOW.items.map((n) => (
              <Link key={n.to} to={n.to}>
                <strong>{n.title}</strong>
                <span>{n.body}</span>
                <Icon name="arrow" />
              </Link>
            ))}
          </aside>
        </section>

        <dl className="context">
          {CONTEXT.map((c) => (
            <div key={c.k}>
              <dt className="label">{c.k}</dt>
              <dd>{c.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="section wrap" aria-labelledby="how-title">
        <div className="section-head">
          <p className="label">01 / How I work</p>
          <h2 className="title" id="how-title">
            Four habits, and where each one shows up.
          </h2>
        </div>
        <ol className="ledger">
          {PRINCIPLES.map((p) => (
            <li key={p.key}>
              <div className="ledger-key">
                <span className="label">{p.key}</span>
              </div>
              <div className="ledger-claim">
                <h3>{p.h}</h3>
                <p>{p.why}</p>
              </div>
              <div className="ledger-proof">
                {p.proof.map((pr) => (
                  <Link className="proof" key={pr.src + pr.lead} to={pr.to} state={pr.src === 'IBM' ? { anchor: 'ibm' } : undefined}>
                    <span className="label">{pr.src}</span>
                    <span>
                      <b>{pr.lead}</b> {pr.text}
                    </span>
                    <Icon name="arrow" />
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap" aria-labelledby="work-title">
        <div className="section-head">
          <p className="label">02 / Selected work</p>
          <h2 className="title" id="work-title">
            What I am building, and where each stands.
          </h2>
        </div>
        <WorkRows />
      </section>
    </>
  );
}
