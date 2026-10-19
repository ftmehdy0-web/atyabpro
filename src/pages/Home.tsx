import { useRef } from 'react';
import { Close } from '../home/Close';
import { Hero } from '../home/Hero';
import { Layers } from '../home/Layers';
import { Name } from '../home/Name';
import { Pair } from '../home/Pair';
import { PriceSheet } from '../home/PriceSheet';
import { enterSections, useGSAP } from '../lib/gsap';
import { useSeo } from '../lib/useSeo';

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useSeo(
    'Atyab Perfumes',
    'Atyab Perfumes: oud perfumes, dehn al oud oils, bakhoor, dakhoon and perfumed body creams, priced in SAR. Order by WhatsApp.',
  );
  useGSAP(() => { enterSections(root.current!); }, { scope: root });

  return (
    <div ref={root}>
      <Hero />
      <Pair />
      <Layers />
      <Name />
      <PriceSheet />
      <Close />
    </div>
  );
}
