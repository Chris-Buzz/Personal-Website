import { Icon } from './IconSprite';
import { nodes as HIVE_NODES } from '../data/hive';
import type { ShotKind } from '../data/content';

/**
 * Styled concept mock for a project — the stand-in visual until real
 * screenshots land in src/assets/projects/<slug>/ (see that folder's README).
 * Used by the Work list rows and as the case-study gallery fallback.
 */
export default function ProjectShot({ kind }: { kind: ShotKind }) {
  if (kind === 'learnai')
    return (
      <div className="shot">
        <div className="app-win">
          <div className="app-bar"><i /><i /><i /><span className="app-title">LearnAI — dashboard</span></div>
          <div className="app-body">
            <div className="task done"><i /><span>1:1 booked — AI roadmap review, Fri 2 PM</span></div>
            <div className="task done"><i /><span>Stripe: payment confirmed</span></div>
            <div className="task"><i /><span>New showcase project published</span></div>
            <div className="ai-strip">
              <Icon name="spark" style={{ width: 12, height: 12, color: 'var(--orange)' }} />
              Digby extension: prompt enhanced on claude.ai
            </div>
          </div>
        </div>
      </div>
    );
  if (kind === 'digby')
    return (
      <div className="shot">
        <div className="app-win">
          <div className="app-bar"><i /><i /><i /><span className="app-title">Digby — vault</span></div>
          <div className="app-body chat-mock">
            <div className="bubble u">what did I note about RAG evals?</div>
            <div className="bubble b">
              Three notes mention RAG evals — the newest connects them to your Planno retro from March.
              <span className="cite">sources: vault/rag-evals.md · vault/planno-retro.md</span>
            </div>
            <div className="dots-mock"><i /><i /><i /></div>
          </div>
        </div>
      </div>
    );
  if (kind === 'cyber')
    return (
      <div className="shot">
        <div className="term">
          <div className="app-bar"><i /><i /><i /><span className="app-title" style={{ color: '#9C8C70' }}>cybergame — round 7</span></div>
          <div className="term-body">
            <div className="ln"><span className="d">incoming: "Your package is held. Verify here →"</span></div>
            <div className="ln"><span className="p">&gt;</span> you flagged: PHISHING</div>
            <div className="ln"><span className="c">correct ✓ +150 — sender domain is 3 days old</span></div>
            <div className="term-bar"><i /></div>
            <div className="ln"><span className="d">level 4: social engineering unlocked</span></div>
          </div>
        </div>
      </div>
    );
  if (kind === 'claudebot')
    return (
      <div className="shot">
        <div className="app-win">
          <div className="app-bar"><i /><i /><i /><span className="app-title">#general — Claudebot</span></div>
          <div className="app-body chat-mock">
            <div className="bubble u">!ask what's due this week</div>
            <div className="bubble b">
              Two things: the CS250 problem set (Thursday) and the club budget form (Friday).
              <span className="cite">sources: #announcements · memory.db</span>
            </div>
            <div className="dots-mock"><i /><i /><i /></div>
          </div>
        </div>
      </div>
    );
  if (kind === 'planno')
    return (
      <div className="shot">
        <div className="app-win">
          <div className="app-bar"><i /><i /><i /><span className="app-title">Planno — Tuesday</span></div>
          <div className="app-body">
            <div className="cal-row"><b>M</b><b>T</b><b className="today">W</b><b>T</b><b>F</b><b>S</b><b>S</b></div>
            <div className="task done"><i /><span>Morning lift — 7:00 AM</span></div>
            <div className="task done"><i /><span>Data Structures problem set</span></div>
            <div className="task"><i /><span>Ship Buzzy memory patch</span></div>
            <div className="ai-strip">
              <Icon name="spark" style={{ width: 12, height: 12, color: 'var(--orange)' }} />
              Rain at 4 PM — move your run to the morning?
            </div>
          </div>
        </div>
      </div>
    );
  if (kind === 'buzzy')
    return (
      <div className="shot">
        <div className="app-win">
          <div className="app-bar"><i /><i /><i /><span className="app-title">Buzzy — offline</span></div>
          <div className="app-body chat-mock">
            <div className="bubble u">What should I focus on this week?</div>
            <div className="bubble b">
              Your planner shows three deadlines. I'd start with the Data Structures set — it feeds Thursday's exam.
              <span className="cite">sources: planner.db · syllabus_cs250</span>
            </div>
            <div className="dots-mock"><i /><i /><i /></div>
          </div>
        </div>
      </div>
    );
  if (kind === 'scraper')
    return (
      <div className="shot">
        <div className="term">
          <div className="app-bar"><i /><i /><i /><span className="app-title" style={{ color: '#9C8C70' }}>scraper — zsh</span></div>
          <div className="term-body">
            <div className="ln"><span className="p">$</span> python scrape.py "mechanical keyboard"</div>
            <div className="ln"><span className="d">launching headless chrome…</span></div>
            <div className="ln"><span className="d">parsing 240 results</span></div>
            <div className="term-bar"><i /></div>
            <div className="ln"><span className="c">done. top pick: 4.8/5 — $74.99 (saved 31%)</span></div>
          </div>
        </div>
      </div>
    );
  // graph
  return (
    <div className="shot">
      <div className="mini-graph">
        <svg viewBox="0 0 400 270" fill="none">
          <g style={{ stroke: 'var(--line)' }} strokeWidth={1.2}>
            <path d="M200 135L120 80M200 135L290 70M200 135L100 190M200 135L300 195M120 80L290 70M100 190L120 80M300 195L290 70" />
          </g>
          <g style={{ stroke: 'var(--orange)' }} strokeWidth={1.4} opacity={0.7}>
            <path d="M200 135L160 210M200 135L255 145" />
          </g>
          <circle cx="120" cy="80" r="7" style={{ fill: 'var(--honey)' }} />
          <circle cx="290" cy="70" r="9" style={{ fill: 'var(--taupe)' }} />
          <circle cx="100" cy="190" r="6" style={{ fill: 'var(--sage)' }} />
          <circle cx="300" cy="195" r="8" style={{ fill: 'var(--honey)' }} />
          <circle cx="160" cy="210" r="5" style={{ fill: 'var(--taupe)' }} />
          <circle cx="255" cy="145" r="6" style={{ fill: 'var(--sage)' }} />
          <path d="M200 117l15.6 9v18l-15.6 9-15.6-9v-18l15.6-9z" style={{ fill: 'var(--orange)' }} />
          <text x="200" y="252" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2" style={{ fill: 'var(--ink-3)' }}>
            {`THE HIVE — ${HIVE_NODES.length} NODES`}
          </text>
        </svg>
      </div>
    </div>
  );
}
