import { SITE, whatsappLink } from '../lib/site';

/** How buying works here, in three plain lines. */
export function Service() {
  return (
    <section className="service" data-section aria-label="How ordering works">
      <div className="service__item" data-enter>
        <h3 className="service__name">Order on WhatsApp</h3>
        <p>
          Send your bag in one tap, or write to{' '}
          <a href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer" className="link-plain" dir="ltr">{SITE.phoneDisplay}</a>.
        </p>
      </div>
      <div className="service__item" data-enter>
        <h3 className="service__name">Confirmed before you pay</h3>
        <p>The total, delivery and payment are agreed with you first. Nothing is charged on this site.</p>
      </div>
      <div className="service__item" data-enter>
        <h3 className="service__name">Ask about any scent</h3>
        <p>
          Not sure which oud is yours? Email <a href={`mailto:${SITE.email}`} className="link-plain">{SITE.email}</a>.
        </p>
      </div>
    </section>
  );
}
