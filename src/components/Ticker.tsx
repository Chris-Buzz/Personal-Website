import { NEWS } from '../data/content';
import Scramble from './Scramble';

/** One line of current news above the header. Renders nothing once the news has passed. */
export default function Ticker() {
  if (Date.now() >= new Date(`${NEWS.until}T00:00:00`).getTime()) return null;
  return (
    <div className="ticker" role="note" aria-label="News">
      <Scramble text={NEWS.text} onMount duration={900} />
      <a href={NEWS.link.href} target="_blank" rel="noopener noreferrer">
        {NEWS.link.label}
      </a>
    </div>
  );
}
