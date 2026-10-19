export type Category = 'perfume' | 'oil' | 'bakhoor' | 'cream' | 'gift';
export type Gender = 'men' | 'women' | 'unisex';

export interface SizeOption {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: Category;
  gender: Gender;
  /** Listed price in SAR (the lowest price when sizes are listed). */
  price: number;
  /** Key into src/data/images.json, e.g. "tiger_oud"; null when no usable photograph exists. */
  image: string | null;
  /** object-position for square crops of wide photographs. */
  focus?: string;
  gallery: string[];
  /** A credited picture of the product's world, shown only while it has no photograph of its own. */
  standIn?: { image: string; alt: string; caption: string };
  /** One-line accord from the catalogue. */
  accord: string;
  type: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  sizes?: SizeOption[];
}
