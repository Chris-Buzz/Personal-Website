import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import IconSprite from './components/IconSprite';
import Header from './components/Header';
import Footer from './components/Footer';
import Buzzy from './components/Buzzy';
import RouteVeil from './components/RouteVeil';

import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import Hive from './pages/Hive';
import Thoughts from './pages/Thoughts';
import About from './pages/About';

const ROUTE_KEY: Record<string, string> = {
  '/': 'home',
  '/work': 'work',
  '/hive': 'hive',
  '/thoughts': 'thoughts',
  '/about': 'about',
};
const routeKeyOf = (pathname: string) =>
  ROUTE_KEY[pathname] ?? (pathname.startsWith('/work/') ? 'work' : 'home');

// The veil sweep (see .route-veil in global.css) fully covers the viewport
// between ~42% and ~56% of its 820ms run. Swap the rendered page while hidden.
const VEIL_SWAP_MS = 400;
const VEIL_DONE_MS = 880;

export default function App() {
  const location = useLocation();
  // What <Routes> actually renders. Held back during the veil sweep so the
  // old page stays up until the screen is covered — no early flash of the
  // destination page.
  const [shown, setShown] = useState(location);
  const shownKey = useRef(location.pathname + location.search);
  const veilRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const key = location.pathname + location.search;

    const swap = () => {
      shownKey.current = key;
      setShown(location);
      document.body.dataset.route = routeKeyOf(location.pathname);
      window.scrollTo(0, 0);
    };

    if (first.current) {
      first.current = false;
      document.body.dataset.route = routeKeyOf(location.pathname);
      return;
    }
    if (key === shownKey.current) return;

    const veil = veilRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!veil || reduce) {
      swap();
      return;
    }

    veil.classList.remove('run');
    // force reflow so the animation restarts
    void veil.offsetWidth;
    veil.classList.add('run');
    const tSwap = setTimeout(swap, VEIL_SWAP_MS);
    const tDone = setTimeout(() => veil.classList.remove('run'), VEIL_DONE_MS);
    return () => {
      clearTimeout(tSwap);
      clearTimeout(tDone);
    };
  }, [location]);

  return (
    <>
      <IconSprite />
      <RouteVeil ref={veilRef} />
      <Header />

      <main>
        <Routes location={shown}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/hive" element={<Hive />} />
          <Route path="/thoughts" element={<Thoughts />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <Buzzy />
    </>
  );
}
