# Project screenshots — drop them here

Put real screenshots in a folder named after the project's slug and they
appear on that project's case-study page (`/work/<slug>`) automatically.
No code changes needed — `src/lib/shots.ts` discovers them at build time.

```
src/assets/projects/
  learnai/
    01-dashboard.png      → caption: "dashboard"
    02-booking-flow.png   → caption: "booking flow"
  digby/
    01-vault.png
  planno/
    01-morning-dump.jpg
```

Rules:

- **Folder name = project slug**: `learnai`, `digby`, `planno`, `cybergame`,
  `claudebot`, `buzzy-the-ai`, `product-scraper`, `this-portfolio`.
- **Formats**: png, jpg, jpeg, webp, gif.
- **Order**: files sort by name — prefix with `01-`, `02-`, … to control order.
- **Captions**: taken from the filename (numeric prefix stripped, dashes →
  spaces). `03-chrome-extension.png` shows as "chrome extension".
- The **first image** doubles as the gallery lead — make it the hero shot.
- Until a folder has images, the case-study page shows the styled concept
  mock instead, labeled as a preview.

Tip: 1600–2000px wide PNGs look crisp on retina screens; webp keeps them small.
