import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/IconSprite';
import { useBuzzy } from '../context/BuzzyContext';
import { PROFILE, ABOUT_FACTS, CHAPTERS, EDUCATION, EXPERIENCE, AWARDS } from '../data/content';

const ChapterHex = ({ n }: { n: string }) => (
  <div className="c2-hex">
    <svg viewBox="0 0 40 44">
      <path d="M20 2L37 12v20L20 42 3 32V12L20 2z" style={{ fill: 'var(--orange-soft)', stroke: 'var(--orange)' }} strokeWidth={1.5} />
    </svg>
    <span>{n}</span>
  </div>
);

export default function About() {
  const { ask } = useBuzzy();
  return (
    <div className="page" id="page-about">
      <div className="wrap">
        <div className="page-hero">
          <div className="kicker">About</div>
          <h1 className="display">
            The longer <em>story.</em>
          </h1>
          <p className="lede">Computer Science student, club president, practice player, builder of AI things. Here's the longer version.</p>
        </div>

        <div className="about-grid">
          <Reveal as="aside" className="profile-card">
            <div className="polaroid" style={{ position: 'relative' }}>
              <div className="pol-tape" />
              <Photo src={PROFILE.photo} fallback={PROFILE.photoFallback} alt={PROFILE.name} />
              <div className="pol-caption">
                <span className="pc-name">{PROFILE.name}</span>
                <span className="pc-loc">NY</span>
              </div>
            </div>
            <div className="profile-meta">
              {ABOUT_FACTS.map((f) => (
                <div className="fact" key={f.k}>
                  <span className="f-k">{f.k}</span>
                  <span className="f-v" style={f.accent ? { color: 'var(--orange-deep)' } : undefined}>
                    {f.v}
                  </span>
                </div>
              ))}
            </div>
            <div className="pc-actions">
              <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>
                <Icon name="mail" style={{ width: 15, height: 15 }} /> Email me
              </a>
              <button className="btn btn-ghost" onClick={() => ask('How can I get in touch with Chris?')}>
                Ask Buzzy
              </button>
            </div>
          </Reveal>

          <div>
            <div className="chapters">
              {CHAPTERS.map((c) => (
                <Reveal className="chapter2" key={c.n}>
                  <ChapterHex n={c.n} />
                  <div className="c2-kicker">{c.k}</div>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                  <div className="c2-tags">
                    {c.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="about-sec-title">Education</Reveal>
            <Reveal className="edu-card">
              <div className="e-top">
                <h4>{EDUCATION.title}</h4>
                <span className="e-date">{EDUCATION.date}</span>
              </div>
              <p className="e-sub">{EDUCATION.sub}</p>
              <div className="e-tags">
                {EDUCATION.courses.map((c) => (
                  <span className="tag" key={c}>{c}</span>
                ))}
              </div>
            </Reveal>

            <Reveal className="about-sec-title">Experience</Reveal>
            <Reveal>
              {EXPERIENCE.map((x) => (
                <div className="xp-row" key={x.role}>
                  <div>
                    <h5>{x.role}</h5>
                    <span className="x-org">{x.org}</span>
                  </div>
                  <span className="x-date">{x.date}</span>
                  <p className="x-note">{x.note}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="about-sec-title">Recognition</Reveal>
            <Reveal className="award-chips">
              {AWARDS.map((a) => (
                <span className="tag" key={a}>{a}</span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
