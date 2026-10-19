import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';

interface Slide {
  image: string;
  alt: string;
  /** object-position, so the bottles stay in frame on tall phone screens. */
  focus: string;
  eyebrow: string;
  title: string;
  to: string;
  cta: string;
}

const slides: Slide[] = [
  {
    image: 'hero_aytyab',
    alt: 'An Atyab perfume bottle in white and gold on marble, with white silk behind it',
    focus: '50% 50%',
    eyebrow: 'The house signature',
    title: 'Atyab',
    to: '/shop/perfumes',
    cta: 'Discover the perfumes',
  },
  {
    image: 'hero_slide_1',
    alt: 'Tiger Oud and Nader bottles with their boxes on black marble, smoke rising under carved arches',
    focus: '62% 50%',
    eyebrow: 'Wild oud, red saffron, smoked amber',
    title: 'Tiger Oud & Nader',
    to: '/product/tiger-oud',
    cta: 'Discover Tiger Oud',
  },
  {
    image: 'hero_slide_2',
    alt: 'Moon Flower and Mashair bottles on a marble table under a crescent moon',
    focus: '46% 50%',
    eyebrow: 'Night flowers and rose',
    title: 'Moon Flower',
    to: '/product/moon-flower',
    cta: 'Discover Moon Flower',
  },
];

const DURATION = 6500;

/** Full-screen photographs of the house, changing on their own; arrows and dots to choose one. */
export function Slider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(t);
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
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.image}
            className={`slide${active ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!active}
          >
            <Img name={s.image} alt={s.alt} sizes="100vw" priority={i === 0} className="slide__pic" style={{ objectPosition: s.focus }} />
            <div className="slide__text">
              <p className="slide__eyebrow">{s.eyebrow}</p>
              {i === 0 ? <h1 className="slide__title">{s.title}</h1> : <h2 className="slide__title">{s.title}</h2>}
              <Link to={s.to} className="slide__cta" tabIndex={active ? 0 : -1}>{s.cta}</Link>
            </div>
          </div>
        );
      })}

      <div className="slider__controls">
        <button type="button" className="slider__arrow" onClick={() => go(index - 1)} aria-label="Previous slide">
          <Icon name="prev" />
        </button>
        <div className="slider__dots">
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              className={`slider__dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
            >
              <span style={{ animationDuration: `${DURATION}ms` }} />
            </button>
          ))}
        </div>
        <button type="button" className="slider__arrow" onClick={() => go(index + 1)} aria-label="Next slide">
          <Icon name="next" />
        </button>
      </div>
    </section>
  );
}
