import manifest from '../data/images.json';

type Entry = { w: number; h: number; sizes: Record<string, number> };
const images = manifest as Record<string, Entry>;

export interface ImageSource {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/** Responsive sources for an image key from the optimized set in public/images. */
export function imageSource(key: string): ImageSource {
  const entry = images[key];
  if (!entry) throw new Error(`Unknown image "${key}"`);
  const labels = Object.keys(entry.sizes);
  const largest = labels[labels.length - 1];
  return {
    src: `${import.meta.env.BASE_URL}images/${key}-${largest}.webp`,
    srcSet: labels.map((l) => `${import.meta.env.BASE_URL}images/${key}-${l}.webp ${entry.sizes[l]}w`).join(', '),
    width: entry.w,
    height: entry.h,
  };
}
