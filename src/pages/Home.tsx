import { useRef } from 'react';
import { Rail } from '../components/Rail';
import { products } from '../data/catalog';
import { Banner } from '../home/Banner';
import { Collections } from '../home/Collections';
import { Gifting } from '../home/Gifting';
import { Ritual } from '../home/Ritual';
import { Service } from '../home/Service';
import { Slider } from '../home/Slider';
import { enterSections, useGSAP } from '../lib/gsap';
import { useSeo } from '../lib/useSeo';

const perfumes = products.filter((p) => p.category === 'perfume');
const oilsAndBakhoor = products.filter((p) => p.category === 'oil' || p.category === 'bakhoor');
const creams = products.filter((p) => p.category === 'cream');

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useSeo(
    'Atyab Perfumes',
    'Atyab Perfumes: oud perfumes, dehn al oud oils, bakhoor, dakhoon and perfumed body creams, priced in SAR. Order by WhatsApp.',
  );
  useGSAP(() => { enterSections(root.current!); }, { scope: root });

  return (
    <div ref={root}>
      <Slider />
      <Collections />
      <Rail id="perfumes-title" eyebrow="Eau de parfum" title="The signatures" products={perfumes} link={{ to: '/shop/perfumes', label: 'All perfumes' }} />
      <Banner
        image="hero_slide_3"
        alt="Smoke rising from a white and gold bakhoor burner beside a blue perfume bottle in a marble hall"
        eyebrow="Bakhoor & dakhoon"
        title="The essence of Arabic incense"
        line="Agarwood over the coal, held under the cloth so the thobe or abaya keeps it all day."
        to="/shop/bakhoor"
        cta="Discover bakhoor"
      />
      <Rail id="oils-title" eyebrow="Oils & incense" title="Dehn, musk & bakhoor" products={oilsAndBakhoor} />
      <Gifting />
      <Rail id="creams-title" eyebrow="For the skin" title="Perfumed body creams" products={creams} link={{ to: '/shop/body-creams', label: 'All body creams' }} />
      <Ritual />
      <Service />
    </div>
  );
}
