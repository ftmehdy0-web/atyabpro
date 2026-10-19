import { useEffect } from 'react';

const BASE = 'Atyab Perfumes';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the document title, description and Open Graph tags for a route. */
export function useSeo(title: string, description: string, image?: string) {
  useEffect(() => {
    const full = title === BASE ? title : `${title} | ${BASE}`;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', image);
  }, [title, description, image]);
}

/** Adds a JSON-LD block for the lifetime of the component. */
export function useJsonLd(data: object | null) {
  const json = data ? JSON.stringify(data) : '';
  useEffect(() => {
    if (!json) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = json;
    document.head.appendChild(script);
    return () => script.remove();
  }, [json]);
}
