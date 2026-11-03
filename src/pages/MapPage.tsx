import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/IconSprite';
import { useGuide } from '../context/GuideContext';
import { MAP_GROUPS, MAP_LINKS, MAP_NOTES, groupOf, mapNote, type MapGroup, type MapNote } from '../data/siteMap';
import { OrbitMap, type MapNodeInput } from '../map/orbitMap';

const ASKS = ['What is Common Memory?', 'What did Chris do at IBM?', 'What is Buzz Off?'];
// Notes the guide reads flare warm white, so they stand out against the orange projects and the grey rest.
const FIRE = '#fff1e0';
const CORE = '#ffffff';
const SHELVED = '#5c5c5c';

/** Node size by role: Chris and the four case studies largest, the parts and tools smallest. */
function radius(n: MapNote): number {
  if (n.group === 'core') return 9;
  if (n.hub) return 7;
  if (n.group === 'projects' || n.group === 'habits' || n.group === 'built') return 5;
  if (n.group === 'work') return 4.5;
  return n.group === 'parts' ? 3.5 : 3;
}

type Side = 'card' | 'list' | null;

export default function MapPage() {
  const nodes = useMemo<MapNodeInput[]>(
    () =>
      MAP_NOTES.map((n) => {
        const g = groupOf(n.group);
        const color = n.group === 'core' ? CORE : n.id === 'Digby history' ? SHELVED : g?.color ?? CORE;
        return { id: n.id, title: n.title, group: n.group, shape: g?.shape ?? 'circle', color, r: radius(n), hub: n.hub };
      }),
    []
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLElement>(null);
  const mapRef = useRef<OrbitMap | null>(null);
  const [selected, setSelected] = useState<MapNote | null>(null);
  const [side, setSide] = useState<Side>(null);
  const [isolated, setIsolated] = useState<MapGroup | null>(null);
  const [legendOpen, setLegendOpen] = useState(() => !window.matchMedia('(max-width: 760px)').matches);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<number | null>(null);
  const { ask, recall, open: guideOpen } = useGuide();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const guideOpenRef = useRef(guideOpen);
  guideOpenRef.current = guideOpen;

  // Room to keep clear on wide screens: an open card or list on the left, the legend on the right, or the guide
  // panel on the right while it is open. Phones stack everything, so they need no room.
  const placeInsets = useCallback(() => {
    const map = mapRef.current;
    const stage = canvasRef.current?.getBoundingClientRect();
    if (!map || !stage) return;
    if (window.matchMedia('(max-width: 760px)').matches) return map.setInsets(0, 0);
    const sidePanel = sideRef.current?.getBoundingClientRect();
    const left = sidePanel && sidePanel.width ? sidePanel.right - stage.left + 16 : 0;
    const guide = document.getElementById('guide-panel')?.getBoundingClientRect();
    if (guideOpenRef.current && guide && guide.width) return map.setInsets(left, stage.right - guide.left + 24);
    const legend = legendRef.current?.getBoundingClientRect();
    map.setInsets(left, legend && legend.width ? stage.right - legend.left + 16 : 0);
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const map = new OrbitMap(el, nodes, MAP_LINKS, {
      onSelect: (id) => {
        setSelected(id ? mapNote(id) ?? null : null);
        setSide(id ? 'card' : null);
      },
      onOpen: (id) => navigateRef.current(mapNote(id)?.to ?? '/'),
      reducedMotion: reduce.matches,
      fireColor: FIRE,
    });
    mapRef.current = map;
    const onResize = () => {
      map.resize();
      placeInsets();
    };
    const sizes = new ResizeObserver(onResize);
    sizes.observe(el);
    onResize();
    const onMotion = () => map.setReducedMotion(reduce.matches);
    reduce.addEventListener('change', onMotion);
    return () => {
      sizes.disconnect();
      reduce.removeEventListener('change', onMotion);
      map.destroy();
      mapRef.current = null;
    };
  }, [nodes, placeInsets]);

  // The guide panel opens over the right of the map: the graph moves into the space left of it, and an open
  // card closes so the two never stack.
  useEffect(() => {
    if (guideOpen && side === 'card') mapRef.current?.select(null);
    placeInsets();
  }, [guideOpen, side, legendOpen, placeInsets]);

  // Each new question to the guide fires the notes it looked up. A question asked before the page opened does not.
  const seenRecall = useRef(recall?.at);
  useEffect(() => {
    if (!recall || recall.at === seenRecall.current) return;
    seenRecall.current = recall.at;
    mapRef.current?.fireRecall(recall.ids);
  }, [recall]);

  const toggleGroup = (g: MapGroup) => {
    const next = isolated === g ? null : g;
    setIsolated(next);
    mapRef.current?.isolate(next);
  };

  const onSearch = (q: string) => {
    setQuery(q);
    const n = mapRef.current?.search(q) ?? 0;
    setFound(q.trim() ? n : null);
  };

  const toggleList = () => {
    if (side === 'list') return setSide(null);
    mapRef.current?.select(null);
    setSide('list');
  };

  const label = (n: MapNote) => {
    const g = groupOf(n.group)?.label ?? 'Chris';
    return n.of ? `${g} · ${n.of}` : g;
  };

  return (
    <section className="map-stage" aria-labelledby="map-title" data-guide={guideOpen ? 'open' : undefined}>
      <h1 className="sr-only" id="map-title">
        Map
      </h1>
      <div className="map-canvas" ref={canvasRef} aria-hidden="true" />

      {side && (
        <div className="map-side" ref={sideRef}>
          {side === 'card' && selected && (
            <aside className="map-card" aria-live="polite">
              <div className="map-card-top">
                <p className="label">{label(selected)}</p>
                <button type="button" className="map-card-close" onClick={() => mapRef.current?.select(null)} aria-label="Close this note">
                  <Icon name="close" />
                </button>
              </div>
              <h2>{selected.title}</h2>
              <p>{selected.desc}</p>
              <Link className="btn btn-line" to={selected.to}>
                Open page <Icon name="arrow" className="ic-arrow" />
              </Link>
            </aside>
          )}
          {side === 'list' && (
            <nav className="map-list-panel" aria-label="Every note on the map">
              <div className="map-card-top">
                <p className="label">All {MAP_NOTES.length} notes</p>
                <button type="button" className="map-card-close" onClick={() => setSide(null)} aria-label="Close the list">
                  <Icon name="close" />
                </button>
              </div>
              {MAP_GROUPS.map((g) => (
                <MapList key={g.id} label={g.label} notes={MAP_NOTES.filter((n) => n.group === g.id)} />
              ))}
              <p className="map-credit">
                Laid out with d3-force-3d (MIT).{' '}
                <a href={`${import.meta.env.BASE_URL}third-party-licenses.txt`}>Licenses</a>
              </p>
            </nav>
          )}
        </div>
      )}

      <aside className="map-legend" ref={legendRef} aria-label="Legend">
        <button type="button" className="map-legend-head" aria-expanded={legendOpen} onClick={() => setLegendOpen(!legendOpen)}>
          Legend <Icon name="chevron" />
        </button>
        {legendOpen && (
          <div className="map-legend-body">
            <p className="label">Statistics</p>
            <ul className="map-stats">
              <li>
                <b>{MAP_NOTES.length}</b> notes
              </li>
              <li>
                <b>{MAP_GROUPS.length}</b> groups
              </li>
              <li>
                <b>{MAP_LINKS.length}</b> links
              </li>
            </ul>
            <p className="label">Notes</p>
            <div className="map-groups" role="group" aria-label="Show one kind of note">
              {MAP_GROUPS.map((g) => (
                <button key={g.id} type="button" aria-pressed={isolated === g.id} onClick={() => toggleGroup(g.id)}>
                  <span className="map-swatch" data-shape={g.shape} style={{ '--dot': g.color } as React.CSSProperties} />
                  {g.label}
                </button>
              ))}
            </div>
            <p className="map-fire-key">
              <span className="map-swatch" data-shape="circle" style={{ '--dot': FIRE } as React.CSSProperties} />
              Notes the guide just read
            </p>
            <p className="label">Ask the guide</p>
            <div className="map-asks">
              {ASKS.map((q) => (
                <button key={q} type="button" onClick={() => ask(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="map-controls" role="group" aria-label="Map view">
        <button type="button" onClick={() => mapRef.current?.fit()}>
          Fit
        </button>
        <button type="button" onClick={() => mapRef.current?.center()}>
          Center
        </button>
        <button type="button" onClick={() => mapRef.current?.zoomBy(1.3)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => mapRef.current?.zoomBy(1 / 1.3)} aria-label="Zoom out">
          −
        </button>
        <button type="button" onClick={toggleList} aria-pressed={side === 'list'}>
          List
        </button>
      </div>

      <div className="map-search">
        <Icon name="search" />
        <input
          type="search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search the map"
          aria-label="Search the map"
          enterKeyHint="search"
        />
        <span className="map-found" aria-live="polite">
          {found === null ? '' : found === 1 ? '1 match' : `${found} matches`}
        </span>
      </div>
    </section>
  );
}

function MapList({ label, notes }: { label: string; notes: MapNote[] }) {
  // Parts read better under the project they belong to.
  const byProject = notes.some((n) => n.of);
  const sets = byProject
    ? [...new Set(notes.map((n) => n.of!))].map((of) => ({ of, notes: notes.filter((n) => n.of === of) }))
    : [{ of: '', notes }];
  return (
    <div className="map-list">
      <h2 className="label">{label}</h2>
      {sets.map((s) => (
        <div key={s.of || label}>
          {s.of && <p className="map-list-of">{s.of}</p>}
          <ul>
            {s.notes.map((n) => (
              <li key={n.id}>
                <Link to={n.to}>{n.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
