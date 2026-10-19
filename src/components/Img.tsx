import { useCallback, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { imageSource } from '../lib/images';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  name: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}

/** An optimized local image with intrinsic size, srcset and lazy loading by default. */
export function Img({ name, alt, sizes, priority = false, onLoad, ...rest }: Props) {
  const s = imageSource(name);
  // Fades in once decoded instead of painting in strips; cached images are already complete.
  const [pending, setPending] = useState(true);
  const ref = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setPending(false);
  }, []);
  const loaded = (e: SyntheticEvent<HTMLImageElement>) => {
    setPending(false);
    onLoad?.(e);
  };
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
      ref={ref}
      onLoad={loaded}
      data-pending={pending && !priority ? '' : undefined}
      {...rest}
    />
  );
}
