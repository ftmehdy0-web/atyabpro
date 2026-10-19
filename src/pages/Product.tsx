import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Img } from '../components/Img';
import { ProductImage } from '../components/ProductImage';
import { ProductTile } from '../components/ProductTile';
import { QtyStepper } from '../components/QtyStepper';
import { WishButton } from '../components/WishButton';
import { getCategory, getProduct, relatedTo } from '../data/catalog';
import type { Product } from '../data/types';
import { imageSource } from '../lib/images';
import { formatPrice, SITE, whatsappLink } from '../lib/site';
import { enterSections, gsap, MOTION, useGSAP } from '../lib/gsap';
import { useJsonLd, useSeo } from '../lib/useSeo';
import { useCartActions } from '../state/cart';
import NotFound from './NotFound';

export default function ProductRoute() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  // Keyed by slug so moving between products starts with fresh choices.
  return product ? <ProductPage key={product.id} p={product} /> : <NotFound />;
}

const noteRows: { key: keyof Product['notes']; label: string }[] = [
  { key: 'top', label: 'Opening' },
  { key: 'heart', label: 'Heart' },
  { key: 'base', label: 'Drydown' },
];

function ProductPage({ p }: { p: Product }) {
  const root = useRef<HTMLDivElement>(null);
  const pictures = p.image ? [p.image, ...p.gallery] : p.gallery;
  const ogImage = p.image ? imageSource(p.image).src : undefined;
  const [shown, setShown] = useState(0);
  const [size, setSize] = useState(p.sizes ? p.sizes[p.sizes.length - 1].label : '');
  const [qty, setQty] = useState(1);
  const { add } = useCartActions();
  const category = getCategory(p.category);
  const unit = p.sizes?.find((s) => s.label === size)?.price ?? p.price;

  useSeo(p.name, `${p.name} by Atyab Perfumes: ${p.accord}. ${formatPrice(p.price)}.`, ogImage);
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Atyab ${p.name}`,
    ...(ogImage ? { image: ogImage } : {}),
    description: p.description,
    brand: { '@type': 'Brand', name: 'Atyab' },
    category: category.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: SITE.currency,
      price: p.price,
    },
  });

  useGSAP(
    () => {
      enterSections(root.current!);
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        gsap.timeline()
          .from('.pdp__main', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.inOut' })
          .from('.pdp__main img', { scale: 1.1, duration: 1.1 }, 0)
          .from('.pdp__info > *', { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 0.3);
      });
    },
    { scope: root },
  );

  const order = whatsappLink(
    `Hello Atyab, I would like ${qty} x ${p.name}${size ? ` (${size})` : ''} at ${formatPrice(unit)} each. Please confirm delivery and payment.`,
  );

  return (
    <div className="pdp" ref={root}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop/${category.path}`}>{category.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="pdp__grid">
        <div className="pdp__media">
          <figure className="pdp__main">
            {pictures.length > 0 ? (
              <Img
                key={pictures[shown]}
                name={pictures[shown]}
                alt={shown === 0 ? `${p.name}, ${p.type}` : `${p.name}, detail ${shown + 1} of ${pictures.length}`}
                sizes="(min-width: 64em) 50vw, 100vw"
                priority
                style={{ objectPosition: shown === 0 ? p.focus : undefined }}
              />
            ) : p.standIn ? (
              <Img name={p.standIn.image} alt={p.standIn.alt} sizes="(min-width: 64em) 50vw, 100vw" priority className="pdp__standin" />
            ) : (
              <ProductImage product={p} alt={`${p.name}: photograph to come`} sizes="50vw" withMark />
            )}
          </figure>
          {pictures.length === 0 && p.standIn && <p className="pdp__caption">{p.standIn.caption}</p>}
          {pictures.length > 1 && (
            <div className="pdp__thumbs" role="group" aria-label="Photographs">
              {pictures.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  className="pdp__thumb"
                  aria-pressed={i === shown}
                  aria-label={`Photograph ${i + 1} of ${pictures.length}`}
                  onClick={() => setShown(i)}
                >
                  <Img name={name} alt="" sizes="96px" style={{ objectPosition: i === 0 ? p.focus : undefined }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          <p className="pdp__ar" lang="ar" dir="rtl">{p.nameAr}</p>
          <h1 className="pdp__title">{p.name}</h1>
          <p className="pdp__accord">{p.accord}</p>
          <p className="pdp__price nums">{formatPrice(unit)}</p>
          <p className="pdp__type">{p.type}</p>

          {p.sizes && (
            <fieldset className="sizes">
              <legend>Size</legend>
              {p.sizes.map((s) => (
                <label key={s.label} className="sizes__opt">
                  <input type="radio" name="size" value={s.label} checked={size === s.label} onChange={() => setSize(s.label)} />
                  <span>{s.label}</span>
                  <span className="nums">{formatPrice(s.price)}</span>
                </label>
              ))}
            </fieldset>
          )}

          <div className="pdp__buy">
            <QtyStepper value={qty} onChange={setQty} label={p.name} />
            <button type="button" className="button pdp__add" onClick={() => add(p.id, size, qty)}>
              Add to bag · <span className="nums">{formatPrice(unit * qty)}</span>
            </button>
            <WishButton id={p.id} name={p.name} className="pdp__wish" />
          </div>
          <a className="button button--quiet button--full" href={order} target="_blank" rel="noopener noreferrer">
            Order this on WhatsApp
          </a>
          <p className="note">Delivery and payment are confirmed with you on WhatsApp. No payment is taken on this site.</p>

          <p className="pdp__desc">{p.description}</p>
        </div>
      </div>

      <section className="notes" data-section aria-labelledby="notes-title">
        <h2 id="notes-title" className="h2" data-enter>How it wears</h2>
        <div className="notes__grid">
          {noteRows.map((row, i) => (
            <div key={row.key} className={`notes__col tone-${i}`} data-enter>
              <h3 className="notes__label">{row.label}</h3>
              <ul>
                {p.notes[row.key].map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="related" data-section aria-labelledby="related-title">
        <h2 id="related-title" className="h2" data-enter>
          {p.category === 'gift' ? 'Pieces from the house' : `More ${category.name.toLowerCase()}`}
        </h2>
        <div className="specs specs--four">
          {relatedTo(p).map((r, i) => (
            <ProductTile key={r.id} product={r} tone={(i + 1) % 4} />
          ))}
        </div>
      </section>
    </div>
  );
}
