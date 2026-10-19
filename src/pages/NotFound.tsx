import { Link } from 'react-router';
import { Suggestions } from '../components/Suggestions';
import { useLang } from '../i18n/lang';
import { useSeo } from '../lib/useSeo';

export default function NotFound() {
  const { t } = useLang();
  const m = t.missing;
  useSeo(t.seo.missing, t.seo.missingDesc);
  return (
    <div className="missing">
      <h1 className="page-title">{m.title}</h1>
      <p>{m.body(<Link to="/" className="link-plain">{m.homeLink}</Link>)}</p>
      <Suggestions title={m.fromHouse} />
    </div>
  );
}
