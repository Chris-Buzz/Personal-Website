// Files for AI agents, built from the same data as the pages so they never disagree with the site:
// - /llms.txt: a short Markdown map of the site, in the llms.txt convention (https://llmstxt.org)
// - /llms-full.txt: every project and fact in full, as Markdown
// - /site.json: the same as structured JSON
// vite.config.ts serves these in dev and writes them into dist/ at build time.
import {
  ABOUT,
  EXPERIENCE,
  HERO,
  MORE,
  PAPER,
  PRINCIPLES,
  PROFILE,
  PROJECTS,
  RECALL,
  SKILLS,
  pluginCommands,
  repoZip,
  type MoreItem,
} from './content';

// Links are relative to wherever the site is deployed. Pages use hash routes, so a page is `/#/work/<slug>`.
const page = (route: string) => `/#${route}`;

function installLines(m: MoreItem, published: boolean): string[] {
  if (!m.install) return [];
  if (m.install.kind === 'repo') {
    return [`  - Clone: \`git clone https://github.com/${m.install.repo}.git\``, `  - ZIP: ${repoZip(m.install.repo, m.install.branch)}`];
  }
  if (!published) return [];
  return [
    `  - Install in Claude Code: \`${pluginCommands(m.install.plugin).join('` then `')}\``,
    `  - ZIP of all the skills: ${repoZip(SKILLS.repo, 'main')}`,
    `  - Needs: ${m.install.needs}`,
  ];
}

export function llmsTxt(published = SKILLS.published): string {
  const lines = [
    `# ${PROFILE.name}`,
    '',
    `> ${HERO.eyebrow}. ${HERO.detail}`,
    '',
    `Based in ${PROFILE.location}. Email ${PROFILE.email}. GitHub ${PROFILE.github}. LinkedIn ${PROFILE.linkedin}.`,
    '',
    'The full text of every page is in /llms-full.txt, and the same facts as JSON are in /site.json.',
    '',
    '## Projects',
    '',
    ...PROJECTS.map((p) => `- [${p.title}](${page(`/work/${p.slug}`)}): ${p.summary} Status: ${p.status.label}.`),
    '',
    '## More work',
    '',
    ...MORE.flatMap((m) => [`- ${m.title} (${m.kind}, ${m.year}): ${m.line} Status: ${m.status.label}.`, ...installLines(m, published)]),
    '',
    '## Experience',
    '',
    ...EXPERIENCE.map((r) => `- ${r.role}, ${r.org}, ${r.place}, ${r.date}.`),
    '',
    '## Optional',
    '',
    `- [About](${page('/about')}): school, experience and research`,
    `- [Map](${page('/map')}): every note on the site as an interactive graph`,
    `- [Paper](${PAPER.href}): ${PAPER.title}, ${PAPER.venue}`,
  ];
  return lines.join('\n') + '\n';
}

export function llmsFullTxt(published = SKILLS.published): string {
  const out: string[] = [`# ${PROFILE.name}`, '', `${HERO.eyebrow}.`, '', HERO.detail, '', ABOUT.lede, ''];
  out.push('## Facts', '', ...ABOUT.facts.map((f) => `- ${f.k}: ${f.v}`), `- Email: ${PROFILE.email}`, `- GitHub: ${PROFILE.github}`, `- LinkedIn: ${PROFILE.linkedin}`, '');
  out.push('## How I work', '');
  for (const h of PRINCIPLES) {
    out.push(`### ${h.key}: ${h.h}`, '', h.why, '', ...h.proof.map((p) => `- ${p.src}: ${p.lead} ${p.text}`), '');
  }
  for (const p of PROJECTS) {
    out.push(`## ${p.title}`, '', `${page(`/work/${p.slug}`)}`, '', `${p.summary} Status: ${p.status.label}. ${p.year}.`, '');
    out.push(...p.meta.map((m) => `- ${m.k}: ${m.v}`), '');
    if (p.note) out.push(p.note, '');
    out.push('### The problem', '', ...p.problem.flatMap((t) => [t, '']));
    out.push('### How it works', '', ...p.how.map((s) => `- ${s.h}: ${s.p}`), '');
    if (p.slug === 'common-memory') {
      out.push(
        '### Measured',
        '',
        `Recall test: ${RECALL.questions} real questions and ${RECALL.unrelated} unrelated prompts (${RECALL.rerun}). Hit in the top 4 and mean reciprocal rank:`,
        '',
        ...RECALL.rows.map((r) => `- ${r.name} (${r.detail}): ${r.hit}%, MRR ${r.mrr}`),
        ''
      );
    }
    out.push('### Decisions', '', ...p.decisions.map((d) => `- ${d.h} ${d.p}`), '');
    out.push('### Where it stands', '', ...p.standing.map((s) => `- ${s.item}: ${s.state}`), '');
  }
  out.push('## More work', '');
  for (const m of MORE) out.push(`### ${m.title}`, '', `${m.kind}, ${m.year}. ${m.status.label}. Built with ${m.tags.join(', ')}.`, '', m.line, '', ...installLines(m, published).map((l) => l.replace(/^ {2}/, '')), '');
  out.push('## Experience', '');
  for (const r of EXPERIENCE) out.push(`### ${r.role}, ${r.org}`, '', `${r.place}, ${r.date}.`, '', ...r.points.map((t) => `- ${t}`), '');
  out.push('## Research', '', `${PAPER.authors}. ${PAPER.title}. ${PAPER.venue}, ${PAPER.id}. ${PAPER.href}`, '');
  return out.join('\n');
}

export function siteJson(published = SKILLS.published) {
  return {
    about: 'Facts from Christopher Buzaid’s site, built from the same data as its pages. Page links are relative to the site.',
    person: {
      name: PROFILE.name,
      summary: HERO.detail,
      location: PROFILE.location,
      email: PROFILE.email,
      github: PROFILE.github,
      linkedin: PROFILE.linkedin,
      facts: ABOUT.facts,
    },
    projects: PROJECTS.map((p) => ({
      title: p.title,
      url: page(`/work/${p.slug}`),
      summary: p.summary,
      status: p.status.label,
      year: p.year,
      tags: p.tags,
      how: p.how,
      decisions: p.decisions,
      standing: p.standing.map((s) => ({ item: s.item, state: s.state })),
    })),
    more: MORE.map((m) => ({
      title: m.title,
      kind: m.kind,
      year: m.year,
      summary: m.line,
      status: m.status.label,
      tags: m.tags,
      install:
        m.install?.kind === 'repo'
          ? { clone: `https://github.com/${m.install.repo}.git`, zip: repoZip(m.install.repo, m.install.branch) }
          : m.install && published
            ? { claudeCode: pluginCommands(m.install.plugin), zip: repoZip(SKILLS.repo, 'main'), needs: m.install.needs }
            : undefined,
    })),
    experience: EXPERIENCE.map((r) => ({ org: r.org, role: r.role, place: r.place, date: r.date, points: r.points })),
    research: PAPER,
    principles: PRINCIPLES.map((h) => ({ key: h.key, claim: h.h, why: h.why })),
  };
}

/** schema.org data about Chris for the page head, so search engines and agents can read who he is without
 *  running the app. */
export function personJsonLd() {
  const knows = [...new Set([...PROJECTS.flatMap((p) => p.tags), ...MORE.flatMap((m) => m.tags)])];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PROFILE.name,
    description: HERO.detail,
    email: `mailto:${PROFILE.email}`,
    homeLocation: { '@type': 'Place', name: PROFILE.location },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Monmouth University' },
    sameAs: [PROFILE.github, PROFILE.linkedin],
    knowsAbout: knows,
  };
}

/** Every agent file by its path in the built site. */
export function agentFiles(published = SKILLS.published): Record<string, string> {
  return {
    'llms.txt': llmsTxt(published),
    'llms-full.txt': llmsFullTxt(published),
    'site.json': JSON.stringify(siteJson(published), null, 2) + '\n',
  };
}
