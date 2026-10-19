import { useRef } from 'react';
import { Link } from 'react-router';
import { Img } from '../components/Img';
import { gsap, MOTION, useGSAP } from '../lib/gsap';

interface Props {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  line: string;
  to: string;
  cta: string;
}

/** A full-width photograph with the title set over it; the picture drifts slower than the page. */
export function Banner({ image, alt, eyebrow, title, line, to, cta }: Props) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add(MOTION.full, () => {
      gsap.fromTo('.banner__pic', { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <section className="banner" ref={root} data-section aria-label={title}>
      <Img name={image} alt={alt} sizes="100vw" className="banner__pic" />
      <div className="banner__text">
        <p className="eyebrow eyebrow--light" data-enter>{eyebrow}</p>
        <h2 className="banner__title" data-enter>{title}</h2>
        <p className="banner__line" data-enter>{line}</p>
        <p data-enter><Link to={to} className="button button--light">{cta}</Link></p>
      </div>
    </section>
  );
}
