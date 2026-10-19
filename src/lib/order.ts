import type { ResolvedLine } from '../state/cart';
import { formatPrice, mailtoLink, whatsappLink } from './site';

/** The order written out as plain text, for WhatsApp or email. */
export function orderText(lines: ResolvedLine[], subtotal: number) {
  const rows = lines.map((l) => {
    const size = l.size ? ` (${l.size})` : '';
    return `- ${l.qty} x ${l.product.name}${size}: ${formatPrice(l.qty * l.unitPrice)}`;
  });
  return [
    'Hello Atyab, I would like to order:',
    ...rows,
    `Subtotal: ${formatPrice(subtotal)}`,
    '',
    'Please confirm the total with delivery, and how to pay.',
  ].join('\n');
}

export const orderWhatsapp = (lines: ResolvedLine[], subtotal: number) => whatsappLink(orderText(lines, subtotal));
export const orderEmail = (lines: ResolvedLine[], subtotal: number) =>
  mailtoLink('Order from atyab website', orderText(lines, subtotal));
