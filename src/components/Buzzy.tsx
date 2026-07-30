import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuzzy } from '../context/BuzzyContext';
import { BUZZY_SUGGESTIONS } from '../data/buzzy';
import { parseSegments, isDigbyRoute, type DigbyCard } from '../lib/digby';
import { PROFILE } from '../data/content';
import { Icon } from './IconSprite';
import DigbyFace from './DigbyFace';

/** GenUI card rendered inside a Digby reply. */
function CardView({ card, onGo }: { card: DigbyCard; onGo: (to: string) => void }) {
  if (card.type === 'contact') {
    return (
      <span className="dg-card">
        <span className="dg-card-t">Reach Chris</span>
        <span className="dg-links">
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`https://www.linkedin.com/in/${PROFILE.linkedinHandle}`} target="_blank" rel="noreferrer">LinkedIn</a>
        </span>
      </span>
    );
  }
  const to = card.to && isDigbyRoute(card.to) ? card.to : '/work';
  return (
    <button className="dg-card dg-card-btn" onClick={() => onGo(to)}>
      <span className="dg-card-t">{card.title}</span>
      {card.body && <span className="dg-card-b">{card.body}</span>}
      {card.tags && (
        <span className="dg-tags">
          {card.tags.slice(0, 4).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
      )}
      <span className="dg-go">
        Open <Icon name="arrow" style={{ width: 12, height: 12 }} />
      </span>
    </button>
  );
}

/** Floating FAB + chat panel. Consumes BuzzyContext so anything can open/ask it. */
export default function Buzzy() {
  const { open, setOpen, messages, typing, live, ask } = useBuzzy();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // autoscroll + focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280);
  }, [open]);

  // dialog a11y: Escape closes; Tab cycles within the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [messages, typing]);

  const send = () => {
    if (!draft.trim()) return;
    ask(draft);
    setDraft('');
  };

  return (
    <>
      <button
        className={`buzzy-fab${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close Digby' : 'Chat with Digby'}
      >
        <DigbyFace size={86} animate="think" eyeTracking earTwitch noseSniff expressions wave body="var(--bg)" />
        <span className="fab-x">
          <Icon name="close" style={{ width: 19, height: 19 }} />
        </span>
      </button>

      <div className={`buzzy-panel${open ? ' open' : ''}`} role="dialog" aria-modal="false" aria-label="Digby chat" ref={panelRef}>
        <div className="bz-head">
          <div className="bz-avatar">
            <DigbyFace size={36} animate="float" expressions body="var(--bg)" />
          </div>
          <div>
            <div className="bz-name">Digby</div>
            <div className="bz-sub">{live ? 'Gemini · RAG over the Hive' : live === false ? 'offline · scripted mode' : 'reads the Hive'}</div>
          </div>
          <div className="bz-status">
            <i />
            Online
          </div>
        </div>

        <div className="bz-body" ref={bodyRef} aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.who}`}>
              {m.who === 'user'
                ? m.text
                : parseSegments(m.text).map((s, i) =>
                    s.kind === 'text' ? (
                      <p key={i}>{s.text}</p>
                    ) : s.kind === 'card' ? (
                      <CardView key={i} card={s.card} onGo={navigate} />
                    ) : (
                      <button key={i} className="dg-action" onClick={() => navigate(s.action.to)}>
                        {s.action.label || 'Take me there'} <Icon name="arrow" style={{ width: 12, height: 12 }} />
                      </button>
                    )
                  )}
              {m.src && (
                <span className="src">
                  <svg width="11" height="11">
                    <use href="#i-hex" />
                  </svg>
                  <span>sources: {m.src}</span>
                </span>
              )}
            </div>
          ))}
          <div className={`bz-typing${typing ? ' show' : ''}`}>
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="bz-chips">
          {BUZZY_SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="bz-input">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask Digby about Chris…"
          />
          <button onClick={send} aria-label="Send">
            <Icon name="send" style={{ width: 17, height: 17 }} />
          </button>
        </div>
      </div>
    </>
  );
}
