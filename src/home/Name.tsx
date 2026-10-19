import { useRef } from 'react';
import { Img } from '../components/Img';
import { categories, inCategory, lowestPrice, products } from '../data/catalog';
import type { Category } from '../data/types';
import { formatPrice } from '../lib/site';
import { gsap, MOTION, useGSAP } from '../lib/gsap';

const slides = [
  { name: 'hero_slide_1', alt: 'Tiger Oud and Nader on black marble under carved arches, with agarwood and amber' },
  { name: 'hero_slide_2', alt: 'Two Atyab bottles on a table beneath a crescent moon and lanterns' },
  { name: 'hero_slide_3', alt: 'An Atyab bottle and a smoking incense burner in a gilded majlis' },
];

const count = (c: Category) => inCategory(c).length;

const facts = [
  { label: 'Pieces in the house', value: String(products.length) },
  { label: 'Families', value: String(categories.length) },
  { label: 'Prices from', value: formatPrice(lowestPrice) },
  { label: 'Orders', value: 'By WhatsApp' },
];

/**
 * Why the name is plural. The signature move lives here: the wide photograph
 * crossfades between the house's three scenes, holding each for about five seconds.
 */
export function Name() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        const frames = gsap.utils.toArray<HTMLElement>('.name__slide', root.current);
        gsap.set(frames.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({ repeat: -1, paused: true });
        frames.forEach((frame, i) => {
          const next = frames[(i + 1) % frames.length];
          tl.to(next, { autoAlpha: 1, duration: 1.6, ease: 'none' }, `+=5.2`)
            .set(frame, { autoAlpha: 0 })
            .set(next, { zIndex: i + 2 }, '<')
            .set(frame, { zIndex: 1 }, '<');
        });
        // Runs only while the photograph is on screen and the tab is visible.
        const st = gsap.timeline({
          scrollTrigger: {
            trigger: '.name__photo',
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => (self.isActive && !document.hidden ? tl.play() : tl.pause()),
          },
        });
        const onVis = () => (document.hidden ? tl.pause() : st.scrollTrigger?.isActive && tl.play());
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
      });
    },
    { scope: root },
  );

  return (
    <section className="name" ref={root} data-section aria-labelledby="name-title">
      <div className="name__head">
        <h2 id="name-title" className="h2" data-enter>Why the name is plural</h2>
        <p className="name__lead" data-enter>
          In Arabic one scent is a ṭīb, and many are atyab. The house makes every layer of that habit:
          the bakhoor in the burner, the oil on the wrist, the cream on the skin and the perfume over all of it.
        </p>
      </div>
      <div className="name__grid">
        <figure className="name__photo" data-enter>
          <div className="name__frame">
            {slides.map((s, i) => (
              <Img key={s.name} name={s.name} alt={i === 0 ? s.alt : ''} aria-hidden={i === 0 ? undefined : true} sizes="(min-width: 64em) 66vw, 100vw" className="name__slide" />
            ))}
          </div>
          <figcaption className="name__note">
            Bakhoor and dakhoon for the burner, dehn al oud and white musk by the tola, {count('cream')} perfumed creams,
            {' '}{count('perfume')} perfumes, and one boxed set that holds the whole habit.
          </figcaption>
        </figure>
        <div className="name__side" data-enter>
          <div className="name__mark">
            <img src={`${import.meta.env.BASE_URL}images/atyab_logo-384.webp`} width={384} height={384} alt="The Atyab mark: Arabic calligraphy shaped as a perfume bottle" loading="lazy" decoding="async" />
          </div>
          <dl className="name__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd className="nums">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
