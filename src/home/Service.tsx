import { useLang } from '../i18n/lang';
import { SITE, whatsappLink } from '../lib/site';

/** How buying works here, in three plain lines. */
export function Service() {
  const { t } = useLang();
  const s = t.service;
  return (
    <section className="service" data-section aria-label={s.label}>
      <div className="service__item" data-enter>
        <h3 className="service__name">{s.wa}</h3>
        <p>
          {s.waLine(<a href={whatsappLink(t.hello)} target="_blank" rel="noopener noreferrer" className="link-plain" dir="ltr">{SITE.phoneDisplay}</a>)}
        </p>
      </div>
      <div className="service__item" data-enter>
        <h3 className="service__name">{s.confirm}</h3>
        <p>{s.confirmLine}</p>
      </div>
      <div className="service__item" data-enter>
        <h3 className="service__name">{s.ask}</h3>
        <p>
          {s.askLine(<a href={`mailto:${SITE.email}`} className="link-plain" dir="ltr">{SITE.email}</a>)}
        </p>
      </div>
    </section>
  );
}
