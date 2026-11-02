import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../components/IconSprite';
import { ABOUT, BEYOND, EXPERIENCE, PAPER, PROFILE } from '../data/content';

export default function About() {
  const [photoOk, setPhotoOk] = useState(true);
  const { state } = useLocation();

  // Proof links on Home pass { anchor } so they land on the matching experience entry.
  useEffect(() => {
    const anchor = (state as { anchor?: string } | null)?.anchor;
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
  }, [state]);
  return (
    <>
      <div className="wrap">
        <header className="about-head">
          <div className="text">
            <p className="label">About</p>
            <h1>Hi, I’m Chris.</h1>
            <p className="lede">{ABOUT.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-solid" href={`mailto:${PROFILE.email}`}>
                Email me
              </a>
              <a className="btn btn-line" href={PROFILE.github} target="_blank" rel="noreferrer">
                GitHub <Icon name="ext" />
              </a>
              <a className="btn btn-line" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <Icon name="ext" />
              </a>
            </div>
          </div>
          {photoOk && (
            <figure className="about-photo">
              <img
                src={PROFILE.photo}
                alt="Chris Buzaid speaking into a microphone at an event, in a navy suit and a light bow tie."
                width={5472}
                height={3648}
                decoding="async"
                onError={() => setPhotoOk(false)}
              />
              <figcaption className="label">{PROFILE.location}</figcaption>
            </figure>
          )}
        </header>

        <dl className="facts">
          {ABOUT.facts.map((f) => (
            <div key={f.k}>
              <dt className="label">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="section wrap" aria-labelledby="xp-title">
        <div className="section-head">
          <p className="label">01 / Experience</p>
          <h2 className="title" id="xp-title">
            Where I have done the work.
          </h2>
        </div>
        <ol className="xp">
          {EXPERIENCE.map((x) => (
            <li key={x.org} id={x.org === 'IBM' ? 'ibm' : undefined}>
              <p className="xp-when label">{x.date}</p>
              <div className="xp-what">
                <h3>{x.org}</h3>
                <p>{x.role}</p>
                <p>{x.place}</p>
              </div>
              {x.points.length > 0 && (
                <ul className="xp-points">
                  {x.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap" aria-labelledby="paper-title">
        <div className="paper">
          <p className="label paper-label">02 / Research</p>
          <div className="paper-text">
            <h2 id="paper-title">{PAPER.title}</h2>
            <p>
              {PAPER.authors}. {PAPER.venue}. {PAPER.id}.
            </p>
          </div>
          <a className="btn btn-line paper-link" href={PAPER.href} target="_blank" rel="noopener noreferrer">
            Read the paper <Icon name="ext" />
          </a>
        </div>
      </section>

      <section className="section wrap" aria-label="Beyond the code">
        <div className="beyond-row">
          <p className="label beyond-label">03 / Beyond the code</p>
          <p className="beyond">{BEYOND}</p>
        </div>
      </section>
    </>
  );
}
