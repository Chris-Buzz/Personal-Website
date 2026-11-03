import { Link } from 'react-router-dom';
import MoreWork from '../components/MoreWork';
import WorkRows from '../components/WorkRows';

export default function Work() {
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <p className="label">Work</p>
        <h1>What I have built, and where each one stands.</h1>
        <p className="lede">
          Four projects with a full page each, then smaller projects, work at IBM, and the tools I made for myself.
        </p>
      </header>
      <WorkRows headingLevel={2} />
      <MoreWork />
      <div className="earlier">
        <p className="label">Earlier</p>
        <p>
          Digby was a personal-assistant project that I shelved on November 1, 2026. Its memory work became{' '}
          <Link className="text-link" to="/work/common-memory">
            Common Memory
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
