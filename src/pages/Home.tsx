import { useRef } from 'react';
import { Rail } from '../components/Rail';
import { products } from '../data/catalog';
import { Banner } from '../home/Banner';
import { Collections } from '../home/Collections';
import { Gifting } from '../home/Gifting';
import { Ritual } from '../home/Ritual';
import { Service } from '../home/Service';
import { Slider } from '../home/Slider';
import { useLang } from '../i18n/lang';
import { enterSections, useGSAP } from '../lib/gsap';
import { useSeo } from '../lib/useSeo';

const perfumes = products.filter((p) => p.category === 'perfume');
const oilsAndBakhoor = products.filter((p) => p.category === 'oil' || p.category === 'bakhoor');
const creams = products.filter((p) => p.category === 'cream');

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const r = t.rails;
  useSeo('Atyab Perfumes', t.seo.home);
  useGSAP(() => { enterSections(root.current!); }, { scope: root });

  return (
    <div ref={root}>
      <Slider />
      <Collections />
      <Rail id="perfumes-title" eyebrow={r.perfumes.eyebrow} title={r.perfumes.title} products={perfumes} link={{ to: '/shop/perfumes', label: r.perfumes.link }} />
      <Banner image="hero_slide_3" to="/shop/bakhoor" />
      <Rail id="oils-title" eyebrow={r.oils.eyebrow} title={r.oils.title} products={oilsAndBakhoor} />
      <Gifting />
      <Rail id="creams-title" eyebrow={r.creams.eyebrow} title={r.creams.title} products={creams} link={{ to: '/shop/body-creams', label: r.creams.link }} />
      <Ritual />
      <Service />
    </div>
  );
}
