// Contact details from the store's own site configuration. The street address
// there is marked unconfirmed, so it is not shown anywhere on this site.
export const SITE = {
  name: 'Atyab Perfumes',
  email: 'info@atyabalarabperfumes.com',
  phone: '+966558879839',
  phoneDisplay: '+966 55 887 9839',
  whatsapp: '966558879839',
  currency: 'SAR',
};

const sar = new Intl.NumberFormat('en-SA', { maximumFractionDigits: 2 });
/** Western digits in both languages, as on Saudi price tags; the riyal sign follows the language. */
export const formatPrice = (n: number, lang: 'en' | 'ar' = 'en') => `${sar.format(n)} ${lang === 'ar' ? 'ر.س' : SITE.currency}`;

export const whatsappLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
