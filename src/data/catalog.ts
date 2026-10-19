import { products } from './products';
import type { Category, Gender, Product } from './types';

export { products };

export interface CategoryInfo {
  id: Category;
  /** URL segment under /shop. */
  path: string;
  name: string;
  nameAr: string;
  line: string;
  lineAr: string;
  /** Key into src/data/images.json for the collection tile. */
  image: string;
}

export const categories: CategoryInfo[] = [
  { id: 'perfume', path: 'perfumes', name: 'Perfumes', nameAr: 'عطور', line: 'Eau de parfum, from oud and saffron to sea air and white flowers.', lineAr: 'عطور من العود والزعفران إلى نسيم البحر والأزهار البيضاء.', image: 'kaaf' },
  { id: 'oil', path: 'oils', name: 'Perfume oils', nameAr: 'دهن', line: 'Dehn al oud and white musk, sold by the tola.', lineAr: 'دهن العود والمسك الأبيض، بالتولة.', image: 'oil_dehn_oud' },
  { id: 'bakhoor', path: 'bakhoor', name: 'Bakhoor', nameAr: 'بخور', line: 'Agarwood chips and dakhoon for the home and the cloth.', lineAr: 'رقائق العود والدخون للبيت والثياب.', image: 'dakhoon' },
  { id: 'cream', path: 'body-creams', name: 'Body creams', nameAr: 'كريمات', line: 'Perfumed creams that hold a scent on the skin.', lineAr: 'كريمات معطّرة تُبقي العطر على البشرة.', image: 'cream_marj_gold' },
  { id: 'gift', path: 'gift-sets', name: 'Gift sets', nameAr: 'هدايا', line: 'A boxed set of perfume, oil and incense.', lineAr: 'صندوق يجمع العطر ودهن العود والبخور.', image: 'gift_set' },
];

export const genders: { id: Gender; name: string }[] = [
  { id: 'men', name: 'For him' },
  { id: 'women', name: 'For her' },
  { id: 'unisex', name: 'Unisex' },
];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));
const categoryByPath = new Map(categories.map((c) => [c.path, c]));
const categoryById = new Map(categories.map((c) => [c.id, c]));

export const getProduct = (slug: string) => bySlug.get(slug);
export const getProductById = (id: string) => byId.get(id);
export const getCategoryByPath = (path: string) => categoryByPath.get(path);
export const getCategory = (id: Category) => categoryById.get(id)!;
export const inCategory = (id: Category) => products.filter((p) => p.category === id);

/** The name without the catalogue's descriptor, for tight lists: "Kaaf Fresh Perfume" -> "Kaaf". */
export const shortName = (p: Product) =>
  p.name.replace(/\s+(Signature Perfume|Eau De Parfum|Fresh Perfume)$/, '');

export const lowestPrice = Math.min(...products.map((p) => p.price));

/** The four layers of the ritual, in the order they are worn. */
export const layers: { category: Category; title: string; line: string; titleAr: string; lineAr: string }[] = [
  { category: 'bakhoor', title: 'First, the smoke', line: 'Bakhoor over the coal, held under the cloth so the thobe or abaya keeps it all day.', titleAr: 'أولًا، الدخان', lineAr: 'البخور على الجمر، يُحتضن تحت الثوب ليبقى عبيره في الثوب أو العباءة طوال اليوم.' },
  { category: 'cream', title: 'Then the skin', line: 'A perfumed cream gives the oil and the perfume something to hold on to.', titleAr: 'ثم البشرة', lineAr: 'كريم معطّر يمنح الدهن والعطر ما يتمسّكان به.' },
  { category: 'oil', title: 'Then the oil', line: 'One stroke of dehn on the wrist and behind the ear. It stays close and lasts.', titleAr: 'ثم الدهن', lineAr: 'لمسة واحدة من الدهن على المعصم وخلف الأذن. يبقى قريبًا ويدوم.' },
  { category: 'perfume', title: 'Last, the perfume', line: 'Sprayed over the rest, it is the scent people meet first.', titleAr: 'وأخيرًا، العطر', lineAr: 'يُرشّ فوق كل ما سبق، وهو أول ما يلقاه الناس منك.' },
];

export function relatedTo(p: Product, count = 4) {
  const same = products.filter((x) => x.category === p.category && x.id !== p.id);
  const rest = products.filter((x) => x.category !== p.category && x.id !== p.id);
  return [...same, ...rest].slice(0, count);
}
