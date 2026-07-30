import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/IconSprite';
import { FEATURED_POST, POSTS } from '../data/content';

export default function Thoughts() {
  return (
    <div className="page" id="page-thoughts">
      <div className="wrap">
        <div className="page-hero">
          <div className="kicker">Writing</div>
          <h1 className="display">
            Notes from the <em>build.</em>
          </h1>
          <p className="lede">Long-form notes on what I'm building and learning. Publishing here does two things: you get the article, and the Hive gets new nodes.</p>
        </div>

        <Reveal className="hive-note">
          <Icon name="hex" style={{ width: 19, height: 19 }} />
          <span>
            <b>Auto-indexed.</b> Every article is chunked, embedded, and linked into the knowledge graph on publish — which is how Buzzy cites exact passages back to you.
          </span>
        </Reveal>

        <Reveal as="article" className="featured">
          <div className="feat-info">
            <div className="f-eyebrow">
              <span className="badge">Featured</span>
              <div className="t-meta"><span>CONCEPT · 12 MIN</span></div>
            </div>
            <h2>{FEATURED_POST.title}</h2>
            <p>{FEATURED_POST.sub}</p>
            <div className="t-meta">
              <span className="hex-mini">
                <Icon name="hex" style={{ width: 12, height: 12 }} />
                {FEATURED_POST.nodes} NODES
              </span>
              <span className="sep" />
              <span>{FEATURED_POST.meta}</span>
            </div>
          </div>
          <div className="feat-art">
            <Photo src="https://picsum.photos/id/180/980/720" alt="Workspace" />
            <svg className="art-overlay" viewBox="0 0 480 340" fill="none" preserveAspectRatio="xMidYMid slice">
              <g style={{ stroke: 'var(--orange-bright)' }} opacity={0.55} strokeWidth={1.2}>
                <path d="M240 170L140 100M240 170L350 90M240 170L130 250M240 170L360 250" />
              </g>
              <circle cx="140" cy="100" r="7" style={{ fill: 'var(--honey)' }} />
              <circle cx="350" cy="90" r="5" style={{ fill: 'var(--orange-soft)' }} />
              <circle cx="130" cy="250" r="6" style={{ fill: 'var(--sage)' }} />
              <circle cx="360" cy="250" r="8" style={{ fill: 'var(--honey)' }} />
              <path d="M240 150l17 10v20l-17 10-17-10v-20l17-10z" style={{ fill: 'var(--orange)' }} />
            </svg>
          </div>
        </Reveal>

        <div className="post-list">
          {POSTS.map((p) => (
            <Reveal as="a" href="#/thoughts" className="post-row" key={p.num}>
              <span className="p-num">{p.num}</span>
              <div>
                <h3>{p.title}</h3>
                <p className="p-sub">{p.sub}</p>
              </div>
              <div className="p-meta">
                <div className="t-meta" style={{ justifyContent: 'flex-end' }}>
                  <span className="hex-mini">
                    <Icon name="hex" style={{ width: 12, height: 12 }} />
                    {p.nodes} NODES
                  </span>
                  <span className="sep" />
                  <span>{p.meta}</span>
                </div>
                <div className="arr-circle">
                  <Icon name="arrow" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
