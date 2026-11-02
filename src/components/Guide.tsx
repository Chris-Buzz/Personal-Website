import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuide } from '../context/GuideContext';
import { GUIDE_SUGGESTIONS } from '../data/guide';
import { parseSegments, isDigbyRoute, type DigbyCard } from '../lib/digby';
import { PROFILE } from '../data/content';
import { Icon } from './IconSprite';
import Scramble from './Scramble';

/** A card the model (or a saved reply) can attach to an answer. */
function CardView({ card, onGo }: { card: DigbyCard; onGo: (to: string) => void }) {
  if (card.type === 'contact') {
    return (
      <span className="msg-card">
        <b>Reach Chris</b>
        <span className="msg-links">
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </span>
      </span>
    );
  }
  const to = card.to && isDigbyRoute(card.to) ? card.to : '/work';
  return (
    <button className="msg-card" onClick={() => onGo(to)}>
      <b>{card.title}</b>
      {card.body && <span>{card.body}</span>}
      <span className="go">
        Open <Icon name="arrow" />
      </span>
    </button>
  );
}

/** The header button that opens and closes the guide. Its name stays fixed; aria-expanded carries the state. */
export function GuideButton() {
  const { open, setOpen } = useGuide();
  return (
    <button
      id="guide-button"
      className="pill-item"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls="guide-panel"
      aria-label="Ask the portfolio guide"
    >
      <Icon name={open ? 'close' : 'chat'} />
      <Scramble text="Ask" />
    </button>
  );
}

/** The chat panel. Any component can open it through useGuide().ask. It is not modal, so focus may leave it. */
export default function Guide() {
  const { open, setOpen, messages, typing, busy, live, ask } = useGuide();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const asked = messages.some((m) => m.who === 'user');

  // Remember what opened the panel so closing it can hand focus back there.
  useEffect(() => {
    if (!open) return;
    const active = document.activeElement as HTMLElement | null;
    openerRef.current = active && !panelRef.current?.contains(active) ? active : document.getElementById('guide-button');
    const t = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => window.clearTimeout(t);
  }, [open]);

  const close = () => {
    setOpen(false);
    (openerRef.current ?? document.getElementById('guide-button'))?.focus();
  };

  // Escape closes. A click outside the panel (and not on its header button) closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        (openerRef.current ?? document.getElementById('guide-button'))?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || document.getElementById('guide-button')?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
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
  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div
      id="guide-panel"
      ref={panelRef}
      className={`guide${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="guide-title"
      aria-hidden={!open}
    >
      <div className="guide-head">
        <div>
          <h2 id="guide-title">Portfolio guide</h2>
          <p>{live ? 'Live model, public notes only' : 'Answers from public project notes'}</p>
        </div>
        <button className="icon-btn" onClick={close} aria-label="Close the guide">
          <Icon name="close" />
        </button>
      </div>

      <div className="guide-body" ref={bodyRef} role="log" aria-live="polite" aria-busy={busy}>
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.who}`}>
            {m.who === 'user'
              ? m.text
              : parseSegments(m.text).map((s, i) =>
                  s.kind === 'text' ? (
                    <p key={i}>{s.text}</p>
                  ) : s.kind === 'card' ? (
                    <CardView key={i} card={s.card} onGo={go} />
                  ) : (
                    <button key={i} className="text-link msg-action" onClick={() => go(s.action.to)}>
                      {s.action.label || 'Take me there'} <Icon name="arrow" />
                    </button>
                  )
                )}
            {m.src && <span className="src">Sources: {m.src}</span>}
          </div>
        ))}
        <div className={`typing${typing ? ' show' : ''}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>

      {!asked && (
        <div className="guide-chips">
          {GUIDE_SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="guide-input">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && send()}
          placeholder="Ask about a project…"
          aria-label="Your question"
          autoComplete="off"
          enterKeyHint="send"
        />
        <button className="icon-btn" onClick={send} aria-label="Send">
          <Icon name="send" />
        </button>
      </div>
    </div>
  );
}
