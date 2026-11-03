import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MORE, SKILLS, pluginCommands, repoZip, type Install, type MoreItem, type MoreKind } from '../data/content';
import { Icon } from './IconSprite';

const GROUPS: { kind: MoreKind; label: string }[] = [
  { kind: 'Project', label: 'Projects' },
  { kind: 'At IBM', label: 'At IBM' },
  { kind: 'Skill or tool', label: 'Skills and tools I built' },
];

/** The smaller work under the four case studies: one card each, grouped by kind. */
export default function MoreWork() {
  return (
    <section className="more" id="more" aria-labelledby="more-title">
      <div className="section-head">
        <p className="label">More work</p>
        <h2 className="title" id="more-title">
          Smaller projects, work at IBM, and the tools I made for myself.
        </h2>
      </div>
      {GROUPS.map((g) => (
        <div className="more-group" key={g.kind}>
          <h3 className="label">{g.label}</h3>
          <ul className="more-list">
            {MORE.filter((m) => m.kind === g.kind).map((m) => (
              <li key={m.id}>
                <MoreCard item={m} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function MoreCard({ item }: { item: MoreItem }) {
  const showInstall = item.install && (item.install.kind === 'repo' || SKILLS.published);
  return (
    <div className="more-card">
      <p className="more-top">
        <strong>{item.title}</strong>
        <span>{item.year}</span>
      </p>
      <p className="more-line">{item.line}</p>
      <p className="more-meta">
        <span className="status" data-tone={item.status.tone}>{item.status.label}</span>
        <span>{item.tags.join(' · ')}</span>
      </p>
      {(item.link || showInstall) && (
        <div className="more-actions">
          {item.link &&
            ('href' in item.link ? (
              <a className="more-link" href={item.link.href} target="_blank" rel="noopener noreferrer">
                {item.link.label} <Icon name="ext" />
              </a>
            ) : (
              <Link className="more-link" to={item.link.to} state={item.kind === 'At IBM' ? { anchor: 'ibm' } : undefined}>
                {item.link.label} <Icon name="arrow" />
              </Link>
            ))}
          {showInstall && <InstallBlock install={item.install!} title={item.title} />}
        </div>
      )}
    </div>
  );
}

/** How to get it: Claude Code install commands for a skill, or a clone command for a public repo, each with a copy
 *  button, plus a ZIP download. */
function InstallBlock({ install, title }: { install: Install; title: string }) {
  const lines = install.kind === 'plugin' ? pluginCommands(install.plugin) : [`git clone https://github.com/${install.repo}.git`];
  const zip = install.kind === 'plugin' ? repoZip(SKILLS.repo, 'main') : repoZip(install.repo, install.branch);
  return (
    <div className="install">
      <div className="install-head">
        <p className="label">{install.kind === 'plugin' ? 'Install in Claude Code' : 'Get it'}</p>
        <CopyButton text={lines.join('\n')} label={`Copy the commands for ${title}`} />
      </div>
      <pre className="install-code">
        <code>{lines.join('\n')}</code>
      </pre>
      {install.kind === 'plugin' && <p className="install-needs">Needs: {install.needs}</p>}
      <a className="more-link" href={zip} download>
        Download ZIP <Icon name="arrow" className="ic-down" />
      </a>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      // Clipboard blocked (an insecure page or a denied permission): the commands stay selectable in the box.
    }
  };
  return (
    <button type="button" className="install-copy" onClick={copy} aria-label={label}>
      <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
