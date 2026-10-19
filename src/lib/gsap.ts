import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: 'expo.out', duration: 0.8 });

/** Media queries handed to gsap.matchMedia so every animation has a reduced-motion branch. */
export const MOTION = {
  full: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

/**
 * Staggered entrance for the parts of a section: each [data-enter] child rises
 * 24px and fades in once, 70ms apart, when the section's top passes 85% of the viewport.
 * Under reduced motion nothing is hidden, so the content is simply there.
 */
export function enterSections(scope: Element | Document = document) {
  const mm = gsap.matchMedia();
  mm.add(MOTION.full, () => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-section]', scope);
    if (scope instanceof HTMLElement && scope.matches('[data-section]')) sections.unshift(scope);
    sections.forEach((section) => {
      const parts = [...section.querySelectorAll('[data-enter]')].filter((el) => el.closest('[data-section]') === section);
      if (!parts.length) return;
      gsap.from(parts, {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    });
  });
  return mm;
}

export { gsap, ScrollTrigger, useGSAP };
