import { localize, type Lang } from '../i18n/lang';
import { strings } from '../i18n/strings';
import type { ResolvedLine } from '../state/cart';
import { formatPrice, mailtoLink, whatsappLink } from './site';

/** The order written out as plain text, for WhatsApp or email. */
export function orderText(lines: ResolvedLine[], subtotal: number, lang: Lang = 'en') {
  const o = strings[lang].order;
  const rows = lines.map((l) => {
    const text = localize(l.product, lang);
    const size = l.size ? ` (${text.size(l.size)})` : '';
    return `- ${l.qty} × ${text.name}${size}: ${formatPrice(l.qty * l.unitPrice, lang)}`;
  });
  return [o.intro, ...rows, `${o.subtotal}: ${formatPrice(subtotal, lang)}`, '', o.outro].join('\n');
}

export const orderWhatsapp = (lines: ResolvedLine[], subtotal: number, lang: Lang = 'en') => whatsappLink(orderText(lines, subtotal, lang));
export const orderEmail = (lines: ResolvedLine[], subtotal: number, lang: Lang = 'en') =>
  mailtoLink(strings[lang].order.subject, orderText(lines, subtotal, lang));
