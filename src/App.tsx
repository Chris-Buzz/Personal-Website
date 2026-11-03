import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import IconSprite from './components/IconSprite';
import Header from './components/Header';
import Footer from './components/Footer';
import Guide from './components/Guide';
import Ticker from './components/Ticker';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { projectBySlug } from './data/content';

// The map page carries its own layout code, so it loads only when someone opens it.
const MapPage = lazy(() => import('./pages/MapPage'));

const TITLES: Record<string, string> = { '/work': 'Work', '/about': 'About', '/map': 'Map' };

function titleFor(path: string) {
  if (path === '/') return 'Chris Buzaid';
  const slug = path.match(/^\/work\/([a-z0-9-]+)$/)?.[1];
  const name = (slug && projectBySlug(slug)?.title) || TITLES[path] || 'Not found';
  return `${name} · Chris Buzaid`;
}

export default function App() {
  const { pathname } = useLocation();
  const [announce, setAnnounce] = useState('');
  const shown = useRef(pathname);

  useLayoutEffect(() => {
    document.title = titleFor(pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  // After a client-side navigation, move focus to the new page and announce its title.
  useEffect(() => {
    if (shown.current === pathname) return;
    shown.current = pathname;
    document.getElementById('main')?.focus({ preventScroll: true });
    setAnnounce(titleFor(pathname));
  }, [pathname]);

  return (
    <>
      <IconSprite />
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Ticker />
      <Header />
      <main id="main" tabIndex={-1}>
        <div key={pathname} className="route">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/digby" element={<Navigate to="/work/common-memory" replace />} />
            <Route path="/work/brain" element={<Navigate to="/work/common-memory" replace />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/map"
              element={
                <Suspense fallback={<p className="wrap page-pad map-loading">Loading the map…</p>}>
                  <MapPage />
                </Suspense>
              }
            />
            <Route path="/hive" element={<Navigate to="/work" replace />} />
            <Route path="/thoughts" element={<Navigate to="/work" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Guide />
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </>
  );
}
