import { Link } from 'react-router-dom';
import { Icon } from '../components/IconSprite';

export default function NotFound() {
  return (
    <div className="wrap missing">
      <header className="page-head">
        <p className="label">404</p>
        <h1>Nothing at this address.</h1>
        <p className="lede">The page may have moved when the site was rebuilt. The work is all one click away.</p>
        <div className="hero-actions">
          <Link className="btn btn-solid" to="/work">
            See the work <Icon name="arrow" />
          </Link>
          <Link className="btn btn-line" to="/">
            Home
          </Link>
        </div>
      </header>
    </div>
  );
}
