import type { ImgHTMLAttributes } from 'react';
import { imageSource } from '../lib/images';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  name: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}

/** An optimized local image with intrinsic size, srcset and lazy loading by default. */
export function Img({ name, alt, sizes, priority = false, ...rest }: Props) {
  const s = imageSource(name);
  return (
    <img
      src={s.src}
      srcSet={s.srcSet}
      sizes={sizes}
      width={s.width}
      height={s.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...rest}
    />
  );
}
