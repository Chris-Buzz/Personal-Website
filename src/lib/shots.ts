// Screenshot drop-in pipeline. Any image placed at
//   src/assets/projects/<slug>/<name>.(png|jpg|jpeg|webp|gif)
// automatically appears in that project's case-study gallery — no code
// changes. Files sort by name (prefix with 01-, 02-, … to order them) and
// the filename becomes the caption ("02-booking-flow.png" → "booking flow").

const files = import.meta.glob('../assets/projects/*/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface Shot {
  url: string;
  caption: string;
}

export const PROJECT_SHOTS: Record<string, Shot[]> = {};

// Sort by source path (stable, human-controlled) — never by the emitted URL,
// which is content-hashed in production builds.
for (const path of Object.keys(files).sort()) {
  const m = path.match(/projects\/([^/]+)\/([^/]+)\.\w+$/);
  if (!m) continue;
  const [, slug, name] = m;
  const caption = name.replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim();
  (PROJECT_SHOTS[slug] ??= []).push({ url: files[path], caption });
}
