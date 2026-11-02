# Review, 2026-11-02

Phase 7 of `/my-design`, run on the built site (production bundle, 32 full-page captures at 1440 and 375 wide in
both themes). Three reviewers in parallel subagents: impeccable critique and audit, design-taste-frontend pre-flight,
and an accessibility pass. Then Chris asked mid-session for the site to feel as fun as heyhaigh.ai, which became a
second pass recorded at the end.

## Fixed

| Finding | Source | Fix |
| --- | --- | --- |
| Focus fell to BODY on every route change | a11y, impeccable | Focus moves to `main` after navigation, and a polite live region announces the page title |
| Current page shown by colour only | a11y | Active nav item gets a filled background and weight 600 |
| Guide button renamed itself on open; Tab trapped in a non-modal panel; no close control inside | a11y | Fixed accessible name with `aria-expanded`, a Close button in the panel, no trap, focus returns to whatever opened it |
| Streaming reply announced chunk by chunk | a11y | `role="log"` with `aria-busy` until the answer is complete |
| Guide panel spilled at short heights; input border 1.48:1; 15px input zooms iOS | a11y, impeccable | `dvh` sizing with a shrinking body, input border `--ink-3`, placeholder colour, 16px input |
| Targets under 44px (footer links, back link, chips, card links) | a11y | All raised to 44px |
| Dashed "Runs on my PC" boundary 2.87:1 | a11y | Uses `--accent-ink` (5.18:1) |
| Forced-colors mode erased filled dots and bars | a11y | `forced-colors` rules |
| Portrait lazy-loaded above the fold, blank in captures | taste, impeccable | Loads eagerly |
| Phone header hid "Email me" and the Ask label | taste, impeccable | Pill keeps labels; email is a corner button; theme toggle moved to the footer on phones |
| Hero claim outranked 5:1 by the name; detail repeated the context strip | taste | Lead raised to 30 to 46px; detail cut to one sentence |
| Targets ("4 mornings") styled like results | taste, impeccable | Plan figures carry a "Target" or "In progress" label and a grey value |
| Ledger proofs were long paragraphs; Brain led every habit | taste, impeccable | Each proof opens on its evidence in bold, about 18 words; Planno leads Privacy |
| Numerals everywhere (sections, ledger, rows, steps) | taste | Kept on sections and steps only |
| Step rules 24px wider than the column | taste | Active tint drawn behind with a pseudo-element |
| "Honest status" headlines declared virtue | taste | "What I am building, and where each stands." and "Four projects, and where each one stands." |
| ISO dates in prose beside "December 2026" | taste | Prose dates on the site |
| About: three equal h2s, the paper section restating Experience | taste | Research and Beyond use the label column with no large h2 |
| "Next project" headline competed with the footer headline | taste | Cut to 32 to 48px |
| In-progress and planned dots looked the same; tones contradicted words | taste, impeccable | Filled = done or live, half = in progress, dashed = planned, with a legend; LearnAI booking site and Planno's next step re-toned |
| Diagram highlight hover-only; tool lists made a long phone stack | impeccable | Tap toggles the highlight; phone shows the tool lists inline and stage names only |
| IBM proofs landed at the top of About | impeccable | They scroll to the IBM entry |
| Dark footer barely lifted off the page | impeccable | Pure black with a top rule |
| Bar column header mismatched the row cells for screen readers | a11y | Hidden on both |

## Rejected, with reasons

- **Add real product visuals to every project** (taste, impeccable). No real captures exist for LearnAI or Planno, and
  Chris's rule is real assets over invented ones. The hover cards now show each project's real numbers instead.
- **Link lainow.com** (impeccable). The live site still advertises features that were never built.
- **Full-width Brain diagram** (taste). It would break the case-study grid; phone layout was compacted instead.
- **Rename "Hi, I'm Chris."** (taste). Kept for warmth after Chris asked for a more fun site.

## Left for Chris

- A resized local copy of the portrait (needs his OK to download it from chrisbuzaid.dev).
- An OG image and `og:url` (needs the production domain).
- Type in rem instead of px, and a 12px floor for mono labels (low).

## Second pass: fun like heyhaigh.ai

Chris: "I want my site to feel as fun and professional as heyhaigh.ai's", then "how he has a great hero section and
also some cool hover animations when you hover over his projects". Studied heyhaigh.ai first (home, Memory Graph,
About, Thoughts). Added only moves that one of his two references has:

- Floating pill nav with a bee home button and icons that move once on hover (heyhaigh.ai).
- A thin black news ticker with scramble-in text that retires itself after its date (heyhaigh.ai).
- Scramble on hover for mono labels (heyhaigh.ai).
- The bee that flies in and lands as the orange square after the name ("Portfolio, simple" Version 8).
- Two evidence cards that fan out of each project row on hover, built from the project's real data (heyhaigh.ai's
  row hover, without mock screenshots).
- "Ask the guide" in the hero, like heyhaigh.ai's RyBot button.

Not done: a hero illustration on the scale of heyhaigh.ai's desk diorama. That is an art job that needs his pick
between concepts, so it is proposed as its own session.
