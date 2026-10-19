import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Gender, Product } from '../data/types';
import { productsAr } from '../data/products.ar';
import { readStored, writeStored } from '../lib/storage';
import { formatPrice } from '../lib/site';
import { strings, type Strings } from './strings';

export type Lang = 'en' | 'ar';

const KEY = 'atyab-lang-v1';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ar';

/** ?lang=ar in the address wins, then the visitor's last choice, then English. */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  return readStored(KEY, isLang, 'en');
}

interface LangValue {
  lang: Lang;
  ar: boolean;
  t: Strings;
  setLang: (l: Lang) => void;
  price: (n: number) => string;
}

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeStored(KEY, l);
  }, []);

  const value = useMemo<LangValue>(
    () => ({ lang, ar: lang === 'ar', t: strings[lang], setLang, price: (n: number) => formatPrice(n, lang) }),
    [lang, setLang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const v = useContext(LangContext);
  if (!v) throw new Error('useLang needs LangProvider');
  return v;
}

/** The product's words in the current language. */
export function localize(p: Product, lang: Lang) {
  const a = lang === 'ar' ? productsAr[p.id] : undefined;
  if (!a) {
    return { name: p.name, otherName: p.nameAr, type: p.type, accord: p.accord, description: p.description, notes: p.notes, size: (s: string) => s, standIn: p.standIn };
  }
  return {
    name: a.name,
    otherName: p.name,
    type: a.type,
    accord: a.accord,
    description: a.description,
    notes: a.notes,
    size: (s: string) => a.sizes?.[s] ?? s,
    standIn: p.standIn && a.standIn ? { ...p.standIn, ...a.standIn } : p.standIn,
  };
}

export function useProductText(p: Product) {
  const { lang } = useLang();
  return localize(p, lang);
}

/** Names that carry both spellings in the catalogue. */
export const pick = (lang: Lang, x: { name: string; nameAr: string }) => (lang === 'ar' ? x.nameAr : x.name);

const genderAr: Record<Gender, string> = { men: 'للرجال', women: 'للنساء', unisex: 'للجنسين' };
export const genderName = (lang: Lang, id: Gender, en: string) => (lang === 'ar' ? genderAr[id] : en);
