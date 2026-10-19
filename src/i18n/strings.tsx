import type { ReactNode } from 'react';
import { SITE } from '../lib/site';

/** A phone number kept left-to-right inside Arabic text. */
const Phone = () => <bdi dir="ltr">{SITE.phoneDisplay}</bdi>;

const en = {
  langName: 'English',
  switchTo: 'العربية',
  switchLabel: 'التبديل إلى العربية',
  currency: 'SAR',

  announce: [
    <>Order on WhatsApp · <Phone /></>,
    'Nineteen pieces of oud, musk and bakhoor',
    'Prices in Saudi riyals, confirmed before you pay',
  ] as ReactNode[],

  skip: 'Skip to content',
  home: 'Atyab Perfumes, home',
  logoName: 'Atyab',
  logoSub: 'Perfumes',
  whatsapp: 'WhatsApp',
  searchProducts: 'Search products',
  search: 'Search',
  searchShop: 'Search the shop',
  wishlistCount: (n: number) => `Wishlist, ${n} saved`,
  bagCount: (n: number) => `Bag, ${n} ${n === 1 ? 'item' : 'items'}`,
  openMenu: 'Open menu',
  menu: 'Menu',
  collections: 'Collections',
  shopAll: 'Shop all',
  wishlist: 'Wishlist',
  bag: 'Bag',
  close: 'Close',
  hello: 'Hello Atyab, I have a question.',
  helloOrder: 'Hello Atyab, I would like to place an order.',

  footer: {
    about: 'About Atyab Perfumes',
    sentence: 'One scent is a ṭīb. Worn together, they are atyab.',
    shop: 'Shop',
    yourOrder: 'Your order',
    account: 'Your account',
    orderOnWa: 'Order on WhatsApp',
    contact: 'Contact',
    news: 'New arrivals by email',
    legal: (year: number) => `© ${year} ${SITE.name}. Prices in Saudi riyals. No payment is taken on this site.`,
    rose: 'Rose plate: “Les Roses: Rosa Damascena, subalba” by Henry Joseph Redouté, CC0, via',
  },

  newsletter: {
    label: 'Your email',
    signUp: 'Sign up',
    empty: 'Enter your email address.',
    bad: 'That email address looks incomplete. Check it and try again.',
    sent: 'Your email app should now open with the sign-up ready to send.',
    hint: 'New scents and restocks, a few times a year.',
    subject: 'Newsletter sign-up',
    body: (email: string) => `Please add ${email} to the Atyab newsletter.`,
  },

  card: {
    from: (price: string) => `From ${price}`,
    chooseSize: 'Choose size',
    addToBag: 'Add to bag',
    save: (name: string) => `Save ${name} to wishlist`,
    unsave: (name: string) => `Remove ${name} from wishlist`,
  },
  prev: (what: string) => `Previous ${what}`,
  next: (what: string) => `Next ${what}`,
  photoToCome: 'Photograph to come',

  slider: {
    label: 'Featured',
    of: (i: number, n: number) => `${i} of ${n}`,
    prev: 'Previous slide',
    next: 'Next slide',
    show: (i: number, title: string) => `Show slide ${i}: ${title}`,
    slides: [
      { eyebrow: 'The house signature', title: 'Atyab', cta: 'Discover the perfumes', alt: 'An Atyab perfume bottle in white and gold on marble, with white silk behind it' },
      { eyebrow: 'Wild oud, red saffron, smoked amber', title: 'Tiger Oud & Nader', cta: 'Discover Tiger Oud', alt: 'Tiger Oud and Nader bottles with their boxes on black marble, smoke rising under carved arches' },
      { eyebrow: 'Night flowers and rose', title: 'Moon Flower', cta: 'Discover Moon Flower', alt: 'Moon Flower and Mashair bottles on a marble table under a crescent moon' },
    ],
  },

  collectionsEyebrow: 'Shop by family',
  collectionsTitle: 'Cherished collections',
  pieces: (n: number) => `${n} ${n === 1 ? 'piece' : 'pieces'}`,

  rails: {
    perfumes: { eyebrow: 'Eau de parfum', title: 'The signatures', link: 'All perfumes' },
    oils: { eyebrow: 'Oils & incense', title: 'Dehn, musk & bakhoor' },
    creams: { eyebrow: 'For the skin', title: 'Perfumed body creams', link: 'All body creams' },
  },

  banner: {
    eyebrow: 'Bakhoor & dakhoon',
    title: 'The essence of Arabic incense',
    line: 'Agarwood over the coal, held under the cloth so the thobe or abaya keeps it all day.',
    cta: 'Discover bakhoor',
    alt: 'Smoke rising from a white and gold bakhoor burner beside a blue perfume bottle in a marble hall',
  },

  gifting: {
    eyebrow: 'The art of gifting',
    title: 'A box for the highest esteem',
    line: 'Gold-stamped leather lined in velvet, holding a 110 ml Tiger Oud, a crystal tola of aged agarwood attar, Signature Bakhoor and a gilded crystal burner, with a calligraphy greeting card.',
    alt: (name: string) => `${name}, open to show the bottles inside`,
    see: 'See the box',
  },

  ritual: {
    eyebrow: 'The Arabian ritual',
    title: <>One scent is a <em>ṭīb</em>. Worn together, they are <em>atyab</em>.</>,
    shop: (cat: string) => `Shop ${cat.toLowerCase()}`,
  },

  service: {
    label: 'How ordering works',
    wa: 'Order on WhatsApp',
    waLine: (link: ReactNode) => <>Send your bag in one tap, or write to {link}.</>,
    confirm: 'Confirmed before you pay',
    confirmLine: 'The total, delivery and payment are agreed with you first. Nothing is charged on this site.',
    ask: 'Ask about any scent',
    askLine: (link: ReactNode) => <>Not sure which oud is yours? Email {link}.</>,
  },

  shop: {
    allTitle: 'The whole house',
    allLine: 'Every Atyab piece: perfumes, oils, bakhoor, body creams and gift sets, priced in Saudi riyals.',
    families: 'Families',
    all: 'All',
    searchLabel: 'Search by name or note',
    placeholder: 'Search a name or a note, like saffron',
    whoFor: 'Who it is for',
    sort: 'Sort',
    sorts: { featured: 'House order', 'price-asc': 'Price, low to high', 'price-desc': 'Price, high to low', name: 'Name, A to Z' },
    clear: 'Clear filters',
    allPieces: 'All pieces',
    more: 'More from the house',
    nothing: 'Nothing matches that',
    tryAnother: (button: ReactNode) => <>Try another note, or {button} to see every piece.</>,
    clearLower: 'clear the filters',
    orStart: 'Or start with these',
  },

  suggest: { title: 'Start with these', seeAll: 'See all nineteen' },

  product: {
    shop: 'Shop',
    breadcrumb: 'Breadcrumb',
    notes: { top: 'Opening', heart: 'Heart', base: 'Drydown' },
    photos: 'Photographs',
    photo: (i: number, n: number) => `Photograph ${i} of ${n}`,
    detail: (name: string, i: number, n: number) => `${name}, detail ${i} of ${n}`,
    toCome: (name: string) => `${name}: photograph to come`,
    size: 'Size',
    addToBag: 'Add to bag',
    orderWa: 'Order this on WhatsApp',
    deliveryNote: 'Delivery and payment are confirmed with you on WhatsApp. No payment is taken on this site.',
    howItWears: 'How it wears',
    moreOf: (cat: string) => `More ${cat.toLowerCase()}`,
    fromHouse: 'Pieces from the house',
    waMessage: (qty: number, name: string, size: string, price: string) =>
      `Hello Atyab, I would like ${qty} x ${name}${size ? ` (${size})` : ''} at ${price} each. Please confirm delivery and payment.`,
  },

  bagPage: {
    title: 'Your bag',
    empty: 'Your bag is empty. Everything you add stays here on this device until you send the order.',
    confirmEmpty: 'Remove everything from your bag?',
    emptyIt: 'Empty the bag',
    summary: 'Order summary',
    items: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`,
    delivery: 'Delivery',
    onWa: 'Confirmed on WhatsApp',
    payNote: 'Online payment is not connected yet. Sending the order passes it to Atyab, who confirm the total with delivery and how to pay.',
    sendWa: 'Send order on WhatsApp',
    sendEmail: 'Send order by email',
  },

  drawer: {
    empty: 'Your bag is empty.',
    browse: 'Browse the shop',
    subtotal: 'Subtotal',
    view: 'View bag',
    each: (price: string) => `${price} each`,
    remove: 'Remove',
    quantity: (name: string) => `Quantity, ${name}`,
    fewer: 'One fewer',
    more: 'One more',
    added: (name: string) => `${name} added to your bag`,
  },

  order: {
    intro: 'Hello Atyab, I would like to order:',
    subtotal: 'Subtotal',
    outro: 'Please confirm the total with delivery, and how to pay.',
    subject: 'Order from atyab website',
  },

  wishlistPage: {
    empty: 'Nothing saved yet. Tap the heart on any piece to keep it here on this device.',
    saved: 'Saved pieces',
  },

  missing: {
    title: 'This page is not here',
    body: (link: ReactNode) => <>The link may be old, or the piece may have left the house. Go back to the {link}, or start with these.</>,
    homeLink: 'home page',
    fromHouse: 'Pieces from the house',
  },

  seo: {
    home: 'Atyab Perfumes: oud perfumes, dehn al oud oils, bakhoor, dakhoon and perfumed body creams, priced in SAR. Order by WhatsApp.',
    shopAll: 'Shop all',
    shopAllDesc: 'All nineteen Atyab pieces: perfumes, oils, bakhoor, body creams and gift sets, with prices in SAR.',
    category: (name: string, line: string) => `${name} from Atyab Perfumes. ${line}`,
    product: (name: string, accord: string, price: string) => `${name} by Atyab Perfumes: ${accord}. ${price}.`,
    bag: 'Your Atyab bag. Send the order on WhatsApp or by email; delivery and payment are confirmed with you.',
    wishlist: 'The Atyab pieces you have saved on this device.',
    missing: 'Page not found',
    missingDesc: 'This page does not exist at Atyab Perfumes.',
  },
};

export type Strings = typeof en;

const ar: Strings = {
  langName: 'العربية',
  switchTo: 'English',
  switchLabel: 'Switch to English',
  currency: 'ر.س',

  announce: [
    <>اطلب عبر واتساب · <Phone /></>,
    'تسع عشرة قطعة من العود والمسك والبخور',
    'الأسعار بالريال السعودي، وتُؤكَّد معك قبل الدفع',
  ],

  skip: 'تخطَّ إلى المحتوى',
  home: 'أطياب للعطور، الصفحة الرئيسية',
  logoName: 'أطياب',
  logoSub: 'للعطور',
  whatsapp: 'واتساب',
  searchProducts: 'ابحث عن منتج',
  search: 'بحث',
  searchShop: 'ابحث في المتجر',
  wishlistCount: (n) => `المفضلة، ${n} محفوظ`,
  bagCount: (n) => `السلة، ${n} ${n === 1 ? 'قطعة' : 'قطع'}`,
  openMenu: 'افتح القائمة',
  menu: 'القائمة',
  collections: 'المجموعات',
  shopAll: 'كل المنتجات',
  wishlist: 'المفضلة',
  bag: 'السلة',
  close: 'إغلاق',
  hello: 'مرحبًا أطياب، لدي سؤال.',
  helloOrder: 'مرحبًا أطياب، أود تقديم طلب.',

  footer: {
    about: 'عن أطياب للعطور',
    sentence: 'العطر الواحد طِيب، ومجتمعةً هي أطياب.',
    shop: 'المتجر',
    yourOrder: 'طلبك',
    account: 'حسابك',
    orderOnWa: 'اطلب عبر واتساب',
    contact: 'تواصل معنا',
    news: 'جديدنا عبر البريد',
    legal: (year) => `© ${year} أطياب للعطور. الأسعار بالريال السعودي. لا يتم الدفع عبر هذا الموقع.`,
    rose: 'لوحة الورد: «الورود: الورد الدمشقي» لهنري جوزيف ريدوتيه، CC0، عبر',
  },

  newsletter: {
    label: 'بريدك الإلكتروني',
    signUp: 'اشترك',
    empty: 'أدخل بريدك الإلكتروني.',
    bad: 'يبدو أن البريد الإلكتروني غير مكتمل. تحقّق منه وحاول مجددًا.',
    sent: 'سيُفتح تطبيق البريد الآن وطلب الاشتراك جاهز للإرسال.',
    hint: 'عطور جديدة وعودة المنتجات، بضع مرات في السنة.',
    subject: 'اشتراك في النشرة البريدية',
    body: (email) => `يرجى إضافة ${email} إلى نشرة أطياب البريدية.`,
  },

  card: {
    from: (price) => `يبدأ من ${price}`,
    chooseSize: 'اختر الحجم',
    addToBag: 'أضف إلى السلة',
    save: (name) => `احفظ ${name} في المفضلة`,
    unsave: (name) => `أزل ${name} من المفضلة`,
  },
  prev: (what) => `السابق: ${what}`,
  next: (what) => `التالي: ${what}`,
  photoToCome: 'الصورة قريبًا',

  slider: {
    label: 'مختارات',
    of: (i, n) => `${i} من ${n}`,
    prev: 'الشريحة السابقة',
    next: 'الشريحة التالية',
    show: (i, title) => `اعرض الشريحة ${i}: ${title}`,
    slides: [
      { eyebrow: 'توقيع الدار', title: 'أطياب', cta: 'اكتشف العطور', alt: 'قارورة عطر أطياب بالأبيض والذهبي على الرخام وخلفها حرير أبيض' },
      { eyebrow: 'عود بري، زعفران أحمر، عنبر مدخّن', title: 'تايقر عود ونادر', cta: 'اكتشف تايقر عود', alt: 'قارورتا تايقر عود ونادر مع علبتيهما على رخام أسود والدخان يتصاعد تحت أقواس منقوشة' },
      { eyebrow: 'أزهار الليل والورد', title: 'مون فلاور', cta: 'اكتشف مون فلاور', alt: 'قارورتا مون فلاور ومشاعر على طاولة رخامية تحت هلال' },
    ],
  },

  collectionsEyebrow: 'تسوّق حسب الفئة',
  collectionsTitle: 'مجموعاتنا المميزة',
  pieces: (n) => (n === 1 ? 'قطعة واحدة' : n === 2 ? 'قطعتان' : n <= 10 ? `${n} قطع` : `${n} قطعة`),

  rails: {
    perfumes: { eyebrow: 'ماء العطر', title: 'عطور الدار', link: 'كل العطور' },
    oils: { eyebrow: 'الدهون والبخور', title: 'دهن ومسك وبخور' },
    creams: { eyebrow: 'للبشرة', title: 'كريمات الجسم المعطّرة', link: 'كل كريمات الجسم' },
  },

  banner: {
    eyebrow: 'البخور والدخون',
    title: 'روح البخور العربي',
    line: 'عود على الجمر، يُحتضن تحت الثوب ليبقى عبيره في الثوب أو العباءة طوال اليوم.',
    cta: 'اكتشف البخور',
    alt: 'دخان يتصاعد من مبخرة بيضاء مذهّبة بجانب قارورة عطر زرقاء في قاعة رخامية',
  },

  gifting: {
    eyebrow: 'فن الإهداء',
    title: 'صندوق لأسمى التقدير',
    line: 'جلد مطبوع بالذهب ومبطّن بالمخمل، يضم تايقر عود 110 مل، وتولة كريستال من دهن العود المعتّق، وبخور أطياب، ومبخرة كريستال مذهّبة، مع بطاقة تهنئة بالخط العربي.',
    alt: (name) => `${name}، مفتوح ليظهر ما بداخله`,
    see: 'شاهد الصندوق',
  },

  ritual: {
    eyebrow: 'الطقس العربي',
    title: <>العطر الواحد <em>طِيب</em>، ومجتمعةً هي <em>أطياب</em>.</>,
    shop: (cat) => `تسوّق ${cat}`,
  },

  service: {
    label: 'كيف يتم الطلب',
    wa: 'اطلب عبر واتساب',
    waLine: (link) => <>أرسل سلتك بلمسة واحدة، أو راسلنا على {link}.</>,
    confirm: 'نؤكّد معك قبل الدفع',
    confirmLine: 'نتفق معك أولًا على المجموع والتوصيل وطريقة الدفع. لا يُخصم أي مبلغ عبر هذا الموقع.',
    ask: 'اسأل عن أي عطر',
    askLine: (link) => <>لست متأكدًا أي عود يناسبك؟ راسلنا على {link}.</>,
  },

  shop: {
    allTitle: 'كل ما في الدار',
    allLine: 'كل منتجات أطياب: عطور ودهون وبخور وكريمات جسم وصناديق هدايا، بالريال السعودي.',
    families: 'الفئات',
    all: 'الكل',
    searchLabel: 'ابحث بالاسم أو النفحة',
    placeholder: 'ابحث باسم أو نفحة، مثل الزعفران',
    whoFor: 'لمن',
    sort: 'الترتيب',
    sorts: { featured: 'ترتيب الدار', 'price-asc': 'السعر: من الأقل', 'price-desc': 'السعر: من الأعلى', name: 'الاسم أبجديًا' },
    clear: 'امسح الفلاتر',
    allPieces: 'كل المنتجات',
    more: 'المزيد من الدار',
    nothing: 'لا توجد نتائج مطابقة',
    tryAnother: (button) => <>جرّب نفحة أخرى، أو {button} لرؤية كل المنتجات.</>,
    clearLower: 'امسح الفلاتر',
    orStart: 'أو ابدأ بهذه',
  },

  suggest: { title: 'ابدأ بهذه', seeAll: 'شاهد المنتجات التسعة عشر' },

  product: {
    shop: 'المتجر',
    breadcrumb: 'مسار التصفح',
    notes: { top: 'الافتتاحية', heart: 'القلب', base: 'القاعدة' },
    photos: 'الصور',
    photo: (i, n) => `الصورة ${i} من ${n}`,
    detail: (name, i, n) => `${name}، تفصيل ${i} من ${n}`,
    toCome: (name) => `${name}: الصورة قريبًا`,
    size: 'الحجم',
    addToBag: 'أضف إلى السلة',
    orderWa: 'اطلبه عبر واتساب',
    deliveryNote: 'نؤكّد التوصيل والدفع معك عبر واتساب. لا يتم الدفع عبر هذا الموقع.',
    howItWears: 'كيف يفوح',
    moreOf: (cat) => `المزيد من ${cat}`,
    fromHouse: 'من منتجات الدار',
    waMessage: (qty, name, size, price) =>
      `مرحبًا أطياب، أود طلب ${qty} × ${name}${size ? ` (${size})` : ''} بسعر ${price} للقطعة. يرجى تأكيد التوصيل والدفع.`,
  },

  bagPage: {
    title: 'سلتك',
    empty: 'سلتك فارغة. كل ما تضيفه يبقى هنا على هذا الجهاز حتى ترسل الطلب.',
    confirmEmpty: 'هل تريد إزالة كل شيء من السلة؟',
    emptyIt: 'أفرغ السلة',
    summary: 'ملخص الطلب',
    items: (n) => (n === 1 ? 'قطعة واحدة' : n === 2 ? 'قطعتان' : n <= 10 ? `${n} قطع` : `${n} قطعة`),
    delivery: 'التوصيل',
    onWa: 'يُؤكَّد عبر واتساب',
    payNote: 'الدفع الإلكتروني غير متاح بعد. عند إرسال الطلب يصل إلى أطياب، ونؤكّد معك المجموع مع التوصيل وطريقة الدفع.',
    sendWa: 'أرسل الطلب عبر واتساب',
    sendEmail: 'أرسل الطلب بالبريد',
  },

  drawer: {
    empty: 'سلتك فارغة.',
    browse: 'تصفّح المتجر',
    subtotal: 'المجموع',
    view: 'عرض السلة',
    each: (price) => `${price} للقطعة`,
    remove: 'إزالة',
    quantity: (name) => `الكمية، ${name}`,
    fewer: 'أنقص واحدة',
    more: 'أضف واحدة',
    added: (name) => `أُضيف ${name} إلى سلتك`,
  },

  order: {
    intro: 'مرحبًا أطياب، أود طلب:',
    subtotal: 'المجموع',
    outro: 'يرجى تأكيد المجموع مع التوصيل وطريقة الدفع.',
    subject: 'طلب من موقع أطياب',
  },

  wishlistPage: {
    empty: 'لا يوجد شيء محفوظ بعد. اضغط على القلب في أي منتج ليبقى هنا على هذا الجهاز.',
    saved: 'المنتجات المحفوظة',
  },

  missing: {
    title: 'هذه الصفحة غير موجودة',
    body: (link) => <>ربما الرابط قديم، أو أن المنتج لم يعد متوفرًا. عُد إلى {link}، أو ابدأ بهذه.</>,
    homeLink: 'الصفحة الرئيسية',
    fromHouse: 'من منتجات الدار',
  },

  seo: {
    home: 'أطياب للعطور: عطور العود ودهن العود والبخور والدخون وكريمات الجسم المعطّرة، بالريال السعودي. اطلب عبر واتساب.',
    shopAll: 'كل المنتجات',
    shopAllDesc: 'كل منتجات أطياب التسعة عشر: عطور ودهون وبخور وكريمات جسم وصناديق هدايا، بالريال السعودي.',
    category: (name, line) => `${name} من أطياب للعطور. ${line}`,
    product: (name, accord, price) => `${name} من أطياب للعطور: ${accord}. ${price}.`,
    bag: 'سلة أطياب. أرسل الطلب عبر واتساب أو البريد، ونؤكّد معك التوصيل والدفع.',
    wishlist: 'منتجات أطياب التي حفظتها على هذا الجهاز.',
    missing: 'الصفحة غير موجودة',
    missingDesc: 'هذه الصفحة غير موجودة في أطياب للعطور.',
  },
};

export const strings = { en, ar };
