import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { replyTo } from '../data/guide';
import { retrieve, streamDigby } from '../lib/digby';

export interface ChatMessage {
  id: number;
  who: 'bot' | 'user';
  text: string;
  src?: string | null;
}

interface GuideApi {
  open: boolean;
  setOpen: (v: boolean) => void;
  messages: ChatMessage[];
  typing: boolean;
  /** true from a question until its answer is complete, so screen readers announce the finished reply once */
  busy: boolean;
  /** true = live model, false = saved replies, null = not asked yet */
  live: boolean | null;
  /** Open the panel and answer a question (used by buttons across the site). */
  ask: (query: string) => void;
  /** The notes looked up for the latest question, best match first; `at` changes with every question. */
  recall: { ids: string[]; at: number } | null;
}

const GuideContext = createContext<GuideApi>({
  open: false,
  setOpen: () => {},
  messages: [],
  typing: false,
  busy: false,
  live: null,
  ask: () => {},
  recall: null,
});

const GREETING: ChatMessage = {
  id: 0,
  who: 'bot',
  text: 'Ask about Chris’s projects or experience. I answer from this site’s public notes only, not from his private notes.',
};

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<boolean | null>(null);
  const [recall, setRecall] = useState<GuideApi['recall']>(null);
  const idRef = useRef(1);
  const msgsRef = useRef<ChatMessage[]>(messages);
  msgsRef.current = messages;

  const ask = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setOpen(true);
    const ret = retrieve(q);
    setRecall({ ids: ret.ids, at: Date.now() });
    const history = msgsRef.current.slice(-8).map(({ who, text }) => ({ who, text }));
    setMessages((m) => [...m, { id: idRef.current++, who: 'user', text: q }]);
    setTyping(true);
    setBusy(true);
    const botId = idRef.current++;

    void (async () => {
      let started = false;
      try {
        await streamDigby(q, history, ret, (full) => {
          if (!started) {
            started = true;
            setTyping(false);
            setMessages((m) => [...m, { id: botId, who: 'bot', text: full, src: ret.sources }]);
          } else {
            setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, text: full } : msg)));
          }
        });
        setLive(true);
        setBusy(false);
      } catch {
        // API unreachable (no key, static hosting) or it died mid-stream: answer from saved replies.
        setLive(false);
        const r = replyTo(q);
        window.setTimeout(
          () => {
            setTyping(false);
            setMessages((m) =>
              started
                ? m.map((msg) => (msg.id === botId ? { ...msg, text: r.t, src: r.src } : msg))
                : [...m, { id: botId, who: 'bot', text: r.t, src: r.src }]
            );
            setBusy(false);
          },
          started ? 0 : 350
        );
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, messages, typing, busy, live, ask, recall }),
    [open, messages, typing, busy, live, ask, recall]
  );
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export const useGuide = () => useContext(GuideContext);
