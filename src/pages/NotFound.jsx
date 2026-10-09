import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta';
import { Icon } from '../components/Icon';
import { Kicker } from '../components/ui';

export default function NotFound() {
  usePageMeta('/404');
  return (
    <section className="nf">
      <span className="nf__code" aria-hidden="true">404</span>
      <div className="stack center">
        <Kicker dot>Wrong take</Kicker>
        <h1 className="display">
          That one <em>did not</em> make the cut.
        </h1>
        <p className="lead">The page you wanted is not here. Run it back from the top.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn--primary">
            Back to the top <Icon name="arrow" size={18} />
          </Link>
          <Link to="/book" className="btn btn--ghost">
            Book a session
          </Link>
        </div>
      </div>
    </section>
  );
}
