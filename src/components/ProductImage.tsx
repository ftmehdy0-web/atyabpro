import type { CSSProperties } from 'react';
import type { Product } from '../data/types';
import { Img } from './Img';

interface Props {
  product: Product;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Show the house mark too, for the large product-page panel. */
  withMark?: boolean;
}

/**
 * The product's photograph, or, when it has none that can be used, its Arabic
 * name set on the tile so the piece still has a face in the catalogue.
 */
export function ProductImage({ product: p, alt, sizes, priority, className, style, withMark = false }: Props) {
  if (p.image) {
    return <Img name={p.image} alt={alt} sizes={sizes} priority={priority} className={className} style={{ objectPosition: p.focus, ...style }} />;
  }
  return (
    <span className={`noimage ${className ?? ''}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      {withMark && <img className="noimage__mark" src="/images/atyab_logo-384.webp" width={384} height={384} alt="" />}
      <span className="noimage__ar" lang="ar" dir="rtl">{p.nameAr}</span>
      <span className="noimage__note">Photograph to come</span>
    </span>
  );
}
