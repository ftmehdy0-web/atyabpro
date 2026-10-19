import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { useLang } from '../i18n/lang';

/** Pictures and links; the words come from the language strings, in the same order. */
const slides = [
  // object-position keeps the bottles in frame on tall phone screens.
  { image: 'hero_aytyab', focus: '50% 50%', to: '/shop/perfumes' },
  { image: 'hero_slide_1', focus: '62% 50%', to: '/product/tiger-oud' },
  { image: 'hero_slide_2', focus: '46% 50%', to: '/product/moon-flower' },
];

const DURATION = 6500;

/** Full-screen photographs of the house, changing on their own; arrows and dots to choose one. */
export function Slider() {
  const { t } = useLang();
  const words = t.slider.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, paused, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <section
      className={`slider${paused ? ' is-paused' : ''}`}
      aria-roledescription="carousel"
      aria-label={t.slider.label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const w = words[i];
        return (
          <div
            key={s.image}
            className={`slide${active ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={t.slider.of(i + 1, slides.length)}
            aria-hidden={!active}
          >
            <Img name={s.image} alt={w.alt} sizes="100vw" priority={i === 0} className="slide__pic" style={{ objectPosition: s.focus }} />
            <div className="slide__text">
              <p className="slide__eyebrow">{w.eyebrow}</p>
              {i === 0 ? <h1 className="slide__title">{w.title}</h1> : <h2 className="slide__title">{w.title}</h2>}
              <Link to={s.to} className="slide__cta" tabIndex={active ? 0 : -1}>{w.cta}</Link>
            </div>
          </div>
        );
      })}

      <div className="slider__controls">
        <button type="button" className="slider__arrow" onClick={() => go(index - 1)} aria-label={t.slider.prev}>
          <Icon name="prev" />
        </button>
        <div className="slider__dots">
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              className={`slider__dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={t.slider.show(i + 1, words[i].title)}
              aria-current={i === index}
            >
              <span style={{ animationDuration: `${DURATION}ms` }} />
            </button>
          ))}
        </div>
        <button type="button" className="slider__arrow" onClick={() => go(index + 1)} aria-label={t.slider.next}>
          <Icon name="next" />
        </button>
      </div>
    </section>
  );
}
