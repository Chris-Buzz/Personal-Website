# Christopher Buzaid — Portfolio

A personal portfolio built around one idea: **everything I make connects into a single knowledge graph you can talk to.**

Design system is **"Honey & Ink"** — muted cream, professional orange, one opinionated serif (Fraunces), a clean sans (Inter), and a mono (JetBrains Mono).

Stack: **Vite + React 18 + TypeScript + react-router-dom + Three.js**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Build / preview:

```bash
npm run build
npm run preview
```

> Requires Node 18+.

---

## What's here

| Page | Route | Highlight |
| --- | --- | --- |
| Home | `#/` | A scroll-driven **Three.js tunnel** cinematic that opens on bare text, dives through a hexagon/particle tunnel, lands in light, then a story band on a living honeycomb background. |
| Work | `#/work` | Editorial case-study rows with CSS-built product mockups. |
| The Hive | `#/hive` | A full-screen **interactive force-directed knowledge graph** (2D canvas): pan, zoom, search, filter, click a node for details. |
| Thoughts | `#/thoughts` | Writing index — featured post + list, all auto-"indexed" into the Hive. |
| About | `#/about` | Story chapters, education, experience, recognition. |
| Buzzy | global | A scripted concept chat assistant ("reads the Hive") openable from anywhere. |

Routing uses **HashRouter** (`#/work`, etc.) so it deploys to any static host with zero config.

---

## Architecture

```
src/
  main.tsx              # entry — mounts <App/> inside providers
  App.tsx               # router, route veil, body[data-route], global chrome
  styles/
    global.css          # the entire Honey & Ink design system (ported 1:1 from the prototype)
  data/                 # all content lives here — pages are data-driven
    content.ts          # projects, posts, about chapters, education, experience
    hive.ts             # knowledge-graph nodes + edges (single source of truth)
    buzzy.ts            # Buzzy's scripted reply rules
  context/
    ThemeContext.tsx    # light/dark, persisted, drives data-theme on <html>
    BuzzyContext.tsx    # open/close + ask(query) from anywhere
  hooks/
    useReveal.ts        # IntersectionObserver scroll-reveal (ref-based)
    useScrollProgress.ts# 0..1 progress of an element through the viewport
  components/
    IconSprite.tsx      # inline SVG <symbol> defs (logo mark + icon set)
    Header.tsx  Footer.tsx  RouteVeil.tsx  Reveal.tsx  Photo.tsx
    Buzzy.tsx           # FAB + chat panel (consumes BuzzyContext)
  three/
    HeroCinematic.tsx   # the WebGL tunnel (Three.js in a single effect)
  graph/
    HiveCanvas.tsx      # the 2D force-directed graph (Canvas 2D)
  pages/
    Home.tsx  Work.tsx  Hive.tsx  Thoughts.tsx  About.tsx
```

**Principle:** content is data, not markup. To add a project, post, or graph node, edit the relevant file in `src/data/` — the pages map over it.

---

## Design tokens

All colors / type / spacing are CSS custom properties in `:root` (and `[data-theme="dark"]`) at the top of `src/styles/global.css`. Use the variables, never hard-coded hexes.

Key ones: `--bg --surface --ink --ink-2 --orange --orange-bright --honey --taupe --sage --line --font-d --font-b --font-m`.

---

## Known follow-ups (see CLAUDE.md)

This was ported from a single-file prototype, so a few things are intentionally left for polish: splitting `global.css` into CSS Modules, tightening TypeScript `strict`, real routing-level code-splitting, swapping the hotlinked portrait for local assets, and wiring Buzzy to a real RAG backend. Details and rationale live in **CLAUDE.md**.
