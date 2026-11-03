import { describe, expect, it } from 'vitest';
import { agentFiles, personJsonLd } from './agentFiles';
import { MORE, PROJECTS, SKILLS, pluginCommands } from './content';

const BANNED = /Overlook|Tally|part-time|return offer|golf center|\bBrain\b/i;

describe('files for AI agents', () => {
  for (const published of [false, true]) {
    const files = agentFiles(published);

    it(`name every project and every piece of smaller work (skills ${published ? 'published' : 'not yet published'})`, () => {
      for (const p of PROJECTS) {
        expect(files['llms.txt'], p.title).toContain(p.title);
        expect(files['llms-full.txt'], p.title).toContain(`## ${p.title}`);
      }
      for (const m of MORE) expect(files['llms.txt'], m.title).toContain(m.title);
    });

    it(`say nothing the site leaves off (skills ${published ? 'published' : 'not yet published'})`, () => {
      for (const [name, text] of Object.entries(files)) expect(text, name).not.toMatch(BANNED);
    });

    it(`show the plugin install commands only once the skills repo is public (${published})`, () => {
      for (const m of MORE.filter((x) => x.install?.kind === 'plugin')) {
        const cmd = pluginCommands(m.install!.kind === 'plugin' ? m.install!.plugin : '')[1];
        expect(files['llms.txt'].includes(cmd), cmd).toBe(published);
        expect(files['site.json'].includes(cmd), cmd).toBe(published);
      }
    });

    it(`keep site.json valid JSON (${published})`, () => {
      const j = JSON.parse(files['site.json']);
      expect(j.projects).toHaveLength(PROJECTS.length);
      expect(j.more).toHaveLength(MORE.length);
    });
  }

  it('always offer the public repos as a clone and a ZIP', () => {
    const text = agentFiles(false)['llms.txt'];
    expect(text).toContain('git clone https://github.com/Chris-Buzz/buzz-and-ink.git');
    expect(text).toContain('https://github.com/Chris-Buzz/buzz-and-ink/archive/refs/heads/main.zip');
  });

  it('describe Chris in schema.org terms with his public profiles', () => {
    const p = personJsonLd();
    expect(p['@type']).toBe('Person');
    expect(p.sameAs).toContain('https://github.com/Chris-Buzz');
    expect(JSON.stringify(p)).not.toMatch(BANNED);
  });

  it('starts with the skills hidden, until the repo is pushed', () => {
    expect(SKILLS.published).toBe(false);
  });
});
