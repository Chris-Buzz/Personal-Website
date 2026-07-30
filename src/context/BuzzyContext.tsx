import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { replyTo } from '../data/buzzy';
import { retrieve, streamDigby } from '../lib/digby';

export interface ChatMessage {
  id: number;
  who: 'bot' | 'user';
  text: string;
  src?: string | null;
}

interface BuzzyApi {
  open: boolean;
  setOpen: (v: boolean) => void;
  messages: ChatMessage[];
  typing: boolean;
  /** true = Gemini live, false = scripted fallback, null = not asked yet */
  live: boolean | null;
  /** Open the panel and answer a question (used by buttons across the site). */
  ask: (query: string) => void;
}

const BuzzyContext = createContext<BuzzyApi>({
  open: false,
  setOpen: () => {},
  messages: [],
  typing: false,
  live: null,
  ask: () => {},
});

const GREETING: ChatMessage = {
  id: 0,
  who: 'bot',
  text: "Hey — I'm Digby, Chris's knowledge engine and one of his projects. I read the Hive — every project, post, and skill on this site — and answer with sources. Ask me anything about his work.",
};

export function BuzzyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [live, setLive] = useState<boolean | null>(null);
  const idRef = useRef(1);
  const msgsRef = useRef<ChatMessage[]>(messages);
  msgsRef.current = messages;

  const ask = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setOpen(true);
    const ret = retrieve(q);
    const history = msgsRef.current.slice(-8).map(({ who, text }) => ({ who, text }));
    setMessages((m) => [...m, { id: idRef.current++, who: 'user', text: q }]);
    setTyping(true);
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
      } catch {
        // API unreachable (vite dev / missing key) or died mid-stream → scripted concept mode
        setLive(false);
        const r = replyTo(q);
        window.setTimeout(() => {
          setTyping(false);
          setMessages((m) =>
            started
              ? m.map((msg) => (msg.id === botId ? { ...msg, text: r.t, src: r.src } : msg))
              : [...m, { id: botId, who: 'bot', text: r.t, src: r.src }]
          );
        }, started ? 0 : 500 + Math.random() * 400);
      }
    })();
  }, []);

  const value = useMemo(() => ({ open, setOpen, messages, typing, live, ask }), [open, messages, typing, live, ask]);
  return <BuzzyContext.Provider value={value}>{children}</BuzzyContext.Provider>;
}

export const useBuzzy = () => useContext(BuzzyContext);
