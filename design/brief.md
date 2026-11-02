# Portfolio brief

Written 2026-11-02 for the `/my-design` run that finishes the site in code. Phases 3 to 6 were done earlier as
claude.ai artifacts (see `links.json`), so this run resumes at the build and the phase 7 review.

## What it is

Christopher Buzaid's personal site. He builds his own AI products, plus websites and tools for small businesses and
family who don't have them, and each one fits the tools people already use, gets measured before anyone trusts it,
and keeps data where it belongs. Each claim points at a project page with evidence. He is not job hunting, so this is not
an application portfolio (his config, 2026-11-02).

## Who reads it

- Small-business owners, family and friends deciding whether he can build them a website or a tool.
- People curious about his products (Brain, Buzz Off, Planno) and the LearnAI research.
- No small-business projects are shown until there is a real client (Chris, 2026-11-02); the spec sites stay off.

## Core jobs

1. Say what he does in one screen.
2. Back each claim with a project page that shows the mechanism and an honest status.
3. Make contact one click away.

## Direction (already picked, not reopened here)

- Buzz & Ink v2: white, true black #0A0A0A, neutral greys, one vivid orange #FF6A00, Geist and Geist Mono.
- "Portfolio, simple" (Version 8, 2026-10-07): huge name with an orange period, a Now panel, plain rows of work, a
  page per project with meta, walkthrough, honest status and a next-project link, an ink footer.
- The signature for this round is information design, not ornament: a "How I work" ledger where each habit
  (integration, evaluation, governance, privacy) links to proof, and one key figure per project row.

## Content rules

- Facts only from the vault notes and the repos, checked 2026-11-02. No guessed dates, numbers or client claims.
- GTS appears only as "AI Research Intern, January to May 2026" (Chris, 2026-11-02), with no description of the work
  and nothing about the current part-time role.
- Left off on purpose: anything about plans after graduation (his call), Overlook Golf Center (an unpaid pitch, not a client), Tally
  (dropped 2026-11-02), Murmur (changing this week), Codex's resume PDF (it described the current GTS role).
- Brain: no repo link, no vault contents, no chat excerpts, no personal data. A diagram and a write-up instead.

## Constraints

- Static React app (Vite, HashRouter), one optional serverless function for the portfolio guide.
- Must read well at 375px and honor reduced motion. Content never depends on JavaScript-driven reveals.
