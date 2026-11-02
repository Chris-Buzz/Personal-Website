# Product

<!-- impeccable:product-schema 1 -->

Rewritten 2026-11-02 for the rebuild on branch `finish-portfolio`. The earlier version (2026-09-22) described the
Hive graph, Thoughts and Digby, which are gone.

## Platform

web

## Users

Small-business owners, family and friends deciding whether Chris can build them a website or a tool, and people
curious about his own products. He is not job hunting, so the site is not an application
portfolio.

## Product Purpose

Christopher Buzaid's personal site. He builds his own AI products, plus websites and tools for small businesses and
family who don't have them, with integration, evaluation, governance and privacy built in. Each claim is backed by a
project page a visitor can judge without taking his word for it.

Success: a visitor understands what he builds in one screen, opens at least one project, then emails him.

## Positioning

Not one more assistant app. The home page's "How I work" ledger lists four habits, and each one links to proof in a
project: IBM's Bob mode and tests, Brain's measured recall and local guardrails, LearnAI's human-led sessions,
Planno's on-device data.

## Operating Context

- Static single-page app (Vite, React, HashRouter) with one serverless function (`api/digby.ts`) for the guide.
- Dates, titles and claims must agree with his resumes.

## Capabilities and Constraints

- Routes: Home, Work, `/work/:slug` (Brain, LearnAI, Buzz Off, Planno), About, a 404 page.
- Portfolio guide: a chat panel opened from the header. Live model when `GEMINI_API_KEY` is set, saved replies
  otherwise. Public notes only.
- Light and dark themes. Reduced motion honored everywhere. Content never depends on a JavaScript reveal.

## Brand Commitments

- Name: Christopher Buzaid ("Chris").
- Buzz & Ink v2: white, true black, neutral greys, one orange (#FF6A00), Geist and Geist Mono.
- Voice: first person, plain, honest about stage, numbers over adjectives, no em dashes or semicolons.

## Evidence on Hand

- All copy: `src/data/content.ts`. Brain's recall numbers come from `node scripts/brain.mjs eval --mode all` in his
  vault (36 cases, re-run 2026-11-02).
- Real assets: the portrait (hotlinked from chrisbuzaid.dev), Buzz Off bowling artwork. No other screenshots.
- Must not ship: a description of GTS work or his current GTS role (GTS appears only as "AI Research Intern, January to
  May 2026"), Overlook Golf Center as a client, LearnAI payments or its browser extension, any Brain vault contents.

## Product Principles

1. Every claim links to proof, or it is cut.
2. Honest stage labels: in daily use, published, in development, planned.
3. The work leads and the interface recedes.
4. One source of truth: the site, the guide and the resume use the same facts.

## Accessibility & Inclusion

- Working bar: WCAG 2.2 AA.
- Full keyboard access, including focus management in the guide panel.
- Status is shown by shape and word, never colour alone.
