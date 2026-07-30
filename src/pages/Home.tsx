import { Link } from 'react-router-dom';
import HeroCinematic from '../three/HeroCinematic';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/IconSprite';
import { useBuzzy } from '../context/BuzzyContext';
import { STORY_BEATS, NEXT_CARDS, INTRO, PROFILE } from '../data/content';

export default function Home() {
  const { ask } = useBuzzy();
  return (
    <div className="page" id="page-home">
      <HeroCinematic />

      <div className="home-after">
        {/* OPENER — the identity moment right after the tunnel lands */}
        <section className="home-intro">
          <div className="wrap intro-grid">
            <Reveal className="intro-copy">
              <div className="kicker">{INTRO.kicker}</div>
              <h2 className="display">
                {INTRO.h} <em>{INTRO.hEm}</em>
              </h2>
              <p className="lede">{INTRO.sub}</p>
              <div className="intro-chips">
                {INTRO.chips.map((c) => (
                  <span className="intro-chip" key={c.k}>
                    <b>{c.k}</b>
                    {c.v}
                  </span>
                ))}
              </div>
              <div className="intro-ctas">
                <Link to="/work" className="btn btn-primary">
                  Browse the work <Icon name="arrow" />
                </Link>
                <button className="btn btn-ghost" onClick={() => ask('Give me the tour — where should I start?')}>
                  Meet Digby <Icon name="spark" />
                </button>
                <a className="btn btn-ghost" href={`mailto:${PROFILE.email}`}>
                  Get in touch <Icon name="mail" />
                </a>
              </div>
            </Reveal>
            <Reveal className="intro-portrait">
              <Photo src={PROFILE.photo} fallback={PROFILE.photoFallback} alt={PROFILE.name} className="intro-ph" />
              <span className="intro-cap">{INTRO.photoCaption}</span>
            </Reveal>
          </div>
        </section>
        {/* STORY — quiet editorial list: number, heading, one paragraph */}
        <section className="home-story">
          <div className="wrap story-inner">
            <div className="kicker">The short version</div>
            <h2 className="display">
              How I got <em>here.</em>
            </h2>
            <div className="story-list">
              {STORY_BEATS.map((b) => (
                <Reveal as="article" className="story-item" key={b.n}>
                  <span className="si-num">{b.n}</span>
                  <div className="si-body">
                    <div className="si-k">{b.k}</div>
                    <h3>{b.h}</h3>
                    <p>{b.p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="wrap">
          <Reveal className="next-head">
            <h2>Have a look around.</h2>
            <p>FOUR WAYS IN</p>
          </Reveal>
          <div className="next-grid">
            {NEXT_CARDS.map((c) => (
              <Reveal as={Link} to={c.to} className="next-card" key={c.to}>
                <span className="nc-num">{c.num}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <span className="nc-go">
                  {c.go} <Icon name="arrow" />
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
