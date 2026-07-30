import { forwardRef } from 'react';

/** Orange sweep with the bee mark, triggered on navigation (see App). */
const RouteVeil = forwardRef<HTMLDivElement>((_, ref) => (
  <div className="route-veil" ref={ref} aria-hidden="true">
    <svg>
      <use href="#buzzy-mark" />
    </svg>
  </div>
));
RouteVeil.displayName = 'RouteVeil';
export default RouteVeil;
