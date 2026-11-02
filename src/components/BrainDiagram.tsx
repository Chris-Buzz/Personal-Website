import { Icon } from './IconSprite';

const SOURCES = ['Claude Code', 'Codex', 'Cursor', 'Antigravity', 'Gemini CLI'];
const EXPORTS = ['ChatGPT', 'Claude.ai', 'Gemini'];

// Short labels for the six stages; the walkthrough under the diagram explains each one.
const STAGES = [
  { name: 'Collect', detail: 'One dated note per chat, tagged with its tool' },
  { name: 'Guard', detail: 'Redact secrets, drop blocked terms' },
  { name: 'Store', detail: 'Markdown vault, read in Obsidian' },
  { name: 'Index', detail: 'Ollama embeddings into LanceDB' },
  { name: 'Recall', detail: 'Meaning plus words, date and tool filters' },
  { name: 'Deliver', detail: 'Hook, profile block, local answers' },
];

const OUTPUTS = [
  { name: 'Claude Code', how: 'Best notes added to each prompt' },
  { name: 'Codex and Gemini', how: 'Profile block kept current' },
  { name: 'ChatGPT and Claude.ai', how: 'Short profile, pasted' },
  { name: 'Me', how: 'Ask command, cited answers from a local model' },
];

interface Props {
  active: number | null;
  onActive: (i: number | null) => void;
}

/** How Brain moves a chat from any tool into one local memory and back out. */
export default function BrainDiagram({ active, onActive }: Props) {
  return (
    <figure className="bd" aria-labelledby="bd-caption">
      <div className="bd-grid">
        <div className="bd-col">
          <p className="label">Read from</p>
          <p className="bd-inline">{SOURCES.join(', ')}</p>
          <ul className="bd-list">
            {SOURCES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="label group-gap">Imported from exports</p>
          <p className="bd-inline">{EXPORTS.join(', ')}</p>
          <ul className="bd-list">
            {EXPORTS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="bd-link" aria-hidden="true">
          <Icon name="arrow" />
        </div>

        <div className="bd-pc">
          <p className="bd-pc-label label">Runs on my PC</p>
          <ol className="bd-stages">
            {STAGES.map((s, i) => (
              <li
                key={s.name}
                className="bd-stage"
                data-active={active === i}
                onMouseEnter={() => onActive(i)}
                onMouseLeave={() => onActive(null)}
                onClick={() => onActive(active === i ? null : i)}
              >
                <span className="num">0{i + 1}</span>
                <b>{s.name}</b>
                <span>{s.detail}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bd-remote">
          <span className="tie" aria-hidden="true" />
          <p>
            <b>Private Git remote.</b> A sync refuses any commit that looks like a secret or carries a
            controlled-information marking.
          </p>
        </div>

        <div className="bd-link" aria-hidden="true">
          <Icon name="arrow" />
        </div>

        <div className="bd-col">
          <p className="label">Delivered to</p>
          <ul>
            {OUTPUTS.map((o) => (
              <li key={o.name}>
                {o.name}
                <small>{o.how}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption id="bd-caption">
        Everything inside the dashed line runs on my PC, including the embedding model and the model behind the ask
        command. Two things leave it: the notes a hook hands to the assistant I am already using, and pushes to the
        private Git remote.
      </figcaption>
    </figure>
  );
}
