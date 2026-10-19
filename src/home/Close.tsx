import { Img } from '../components/Img';
import { Newsletter } from '../components/Newsletter';
import { SITE, whatsappLink } from '../lib/site';

const strip = [
  { name: 'oil_dehn_oud', alt: 'Dehn al oud in a gold-capped bottle beside a burner and agarwood chips' },
  { name: 'gift_set', alt: 'The Signature Kings gift box open on marble, three bottles inside' },
  { name: 'angles/backhoor_chips', alt: 'Bakhoor chips in an Atyab tin' },
];

/** Three photographs, then a field: the newsletter and the direct line. */
export function Close() {
  return (
    <section className="close" data-section aria-labelledby="close-title">
      <div className="close__strip" data-enter>
        {strip.map((s) => (
          <Img key={s.name} name={s.name} alt={s.alt} sizes="(min-width: 48em) 34vw, 100vw" />
        ))}
      </div>
      <div className="close__band">
        <div className="close__text" data-enter>
          <h2 id="close-title" className="close__title">Hear when a new scent arrives</h2>
          <p className="close__small">
            Or ask us anything now on{' '}
            <a className="link-plain" href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer">
              WhatsApp, {SITE.phoneDisplay}
            </a>
            .
          </p>
        </div>
        <div className="close__form" data-enter>
          <Newsletter />
        </div>
      </div>
    </section>
  );
}
