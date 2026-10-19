import { Link } from 'react-router';
import { Suggestions } from '../components/Suggestions';
import { useSeo } from '../lib/useSeo';

export default function NotFound() {
  useSeo('Page not found', 'This page does not exist at Atyab Perfumes.');
  return (
    <div className="missing">
      <h1 className="page-title">This page is not here</h1>
      <p>
        The link may be old, or the piece may have left the house. Go back to the{' '}
        <Link to="/" className="link-plain">home page</Link>, or start with these.
      </p>
      <Suggestions title="Pieces from the house" />
    </div>
  );
}
