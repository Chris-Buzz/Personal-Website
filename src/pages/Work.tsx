import { Link } from 'react-router-dom';
import WorkRows from '../components/WorkRows';

export default function Work() {
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <p className="label">Work</p>
        <h1>Four projects, and where each one stands.</h1>
        <p className="lede">
          Open one for how it works, what I decided and why, and what is still unfinished.
        </p>
      </header>
      <WorkRows headingLevel={2} />
      <div className="earlier">
        <p className="label">Earlier</p>
        <p>
          Digby was a personal-assistant project that I shelved on November 1, 2026. Its memory work became{' '}
          <Link className="text-link" to="/work/brain">
            Brain
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
