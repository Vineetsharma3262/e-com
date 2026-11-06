const delivery = [
  "Delivered in 3–6 business days across India",
  "Free shipping on orders over ₹299",
  "Easy returns and exchanges within 7 days of delivery",
  "Cash on delivery available on most pin codes",
];

const copy = {
  menswear: {
    blurb: (name) =>
      `The ${name} is cut for an easy, everyday fit in breathable fabric that holds its shape wash after wash. Dress it up or down, from the office to the weekend.`,
    details: [
      "Regular fit, true to size",
      "Breathable, skin-friendly fabric",
      "Reinforced stitching at stress points",
      'Model is 6\'0" and wears size M',
    ],
    care: [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Warm iron on the reverse",
      "Dry in shade",
    ],
  },
  womenswear: {
    blurb: (name) =>
      `The ${name} pairs a flattering silhouette with soft, comfortable fabric. An easy piece to style for workdays, festive evenings and everything in between.`,
    details: [
      "Relaxed, flattering fit",
      "Soft fabric with a gentle drape",
      "Finished seams for a clean look",
      'Model is 5\'7" and wears size S',
    ],
    care: [
      "Gentle machine wash or hand wash cold",
      "Wash dark colours separately",
      "Do not tumble dry",
      "Iron on low heat",
    ],
  },
  footwear: {
    blurb: (name) =>
      `The ${name} is built for all-day comfort, with a cushioned footbed and a durable, grippy sole. Easy to wear and easy to pair with your everyday looks.`,
    details: [
      "Cushioned, lightweight footbed",
      "Durable anti-slip sole",
      "Standard UK sizing",
      "Comes in a protective box",
    ],
    care: [
      "Wipe clean with a damp cloth",
      "Air dry away from direct heat",
      "Store in a cool, dry place",
      "Use a shoe tree to keep the shape",
    ],
  },
  leather: {
    blurb: (name) =>
      `The ${name} is made to be used every day, with neat finishing, sturdy hardware and a practical shape. A dependable piece that only gets better with time.`,
    details: [
      "Sturdy hardware and neat edge finishing",
      "Practical, everyday size",
      "Comes with a dust bag",
      "Quality checked before dispatch",
    ],
    care: [
      "Wipe with a soft dry cloth",
      "Keep away from direct sunlight and moisture",
      "Store in the dust bag provided",
      "Condition leather every few months",
    ],
  },
  soft: {
    blurb: (name) =>
      `The ${name} is a small everyday essential, finished neatly and ready to use straight away. Lightweight, packable and easy to keep in a bag or drawer.`,
    details: [
      "Soft, everyday fabric",
      "Neat finishing",
      "Lightweight and packable",
      "Quality checked before dispatch",
    ],
    care: [
      "Gentle hand wash cold",
      "Do not bleach",
      "Air dry flat",
      "Keep away from moisture",
    ],
  },
};

const apparel = ["XS", "S", "M", "L", "XL"];
const menTop = ["S", "M", "L", "XL"];
const ukFull = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
const ukWomen = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"];
const ukBoots = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];

const raw = [
  ["cotton-handkerchief-set", "Everyday Cotton Handkerchief Set", 200, "bags", ["One size"], "soft"],
  ["cotton-scrunchie-set", "Everyday Cotton Scrunchie Set", 249, "bags", ["One size"], "soft"],
  ["basic-flip-flops", "Everyday Basic Flip Flops", 299, "footwear", ukFull, "footwear"],
  ["leatherette-keychain", "Classic Leatherette Keychain", 349, "bags", ["One size"], "leather"],
  ["cotton-crew-neck-tee", "Classic Cotton Crew Neck T-Shirt", 449, "men", menTop, "menswear"],
  ["ribbed-crop-top", "Everyday Ribbed Crop Top", 499, "women", apparel, "womenswear"],
  ["relaxed-fit-tee", "Urban Relaxed Fit T-Shirt", 599, "men", menTop, "menswear"],
  ["comfort-slides", "Comfort Everyday Slides", 649, "footwear", ukFull, "footwear"],
  ["floral-summer-top", "Bloom Floral Summer Top", 799, "women", apparel, "womenswear"],
  ["leather-cardholder", "Heritage Leather Cardholder", 899, "bags", ["One size"], "leather"],
  ["casual-polo-tee", "Essential Casual Polo T-Shirt", 999, "men", menTop, "menswear"],
  ["strappy-flat-sandals", "Bella Strappy Flat Sandals", 1199, "footwear", ukWomen, "footwear"],
  ["cotton-kurti", "Classic Cotton Kurti", 1299, "women", apparel, "womenswear"],
  ["cotton-tote-bag", "Everyday Cotton Tote Bag", 1499, "bags", ["One size"], "soft"],
  ["wide-leg-trousers", "Essential Wide Leg Trousers", 1699, "women", apparel, "womenswear"],
  ["oxford-shirt", "Essential Oxford Shirt", 1899, "men", menTop, "menswear"],
  ["canvas-sneakers", "Urban Classic Canvas Sneakers", 2199, "footwear", ukFull, "footwear"],
  ["mini-sling-bag", "Mini Everyday Sling Bag", 2499, "bags", ["One size"], "leather"],
  ["slim-fit-jeans", "Heritage Slim Fit Jeans", 2799, "men", ["28", "30", "32", "34", "36"], "menswear"],
  ["block-heel-sandals", "Luna Block Heel Sandals", 3199, "footwear", ukWomen, "footwear"],
  ["satin-midi-dress", "Bella Satin Midi Dress", 3699, "women", apparel, "womenswear"],
  ["serena-coord-set", "Serena Co-ord Set", 4299, "women", apparel, "womenswear"],
  ["chunky-sneakers", "StreetFlex Chunky Sneakers", 4999, "footwear", ukFull, "footwear"],
  ["wallet-belt-set", "Executive Leather Wallet & Belt Set", 5499, "bags", ["32", "34", "36", "38"], "leather"],
  ["classic-tote-bag", "Bella Classic Tote Bag", 5999, "bags", ["One size"], "leather"],
  ["leather-biker-jacket", "Heritage Leather Biker Jacket", 6999, "men", menTop, "menswear"],
  ["chelsea-boots", "Elite Leather Chelsea Boots", 7499, "footwear", ukBoots, "footwear"],
  ["velvet-evening-gown", "Luxe Velvet Evening Gown", 7999, "women", apparel, "womenswear"],
  ["leather-duffel-bag", "Heritage Leather Duffel Bag", 8999, "bags", ["One size"], "leather"],
  ["premium-leather-handbag", "Signature Premium Leather Handbag", 9500, "bags", ["One size"], "leather"],
];

export const products = raw.map(([slug, name, price, category, sizes, kind]) => {
  const profile = copy[kind];
  return {
    slug,
    name,
    price,
    category,
    sizes,
    kind,
    image: `/images/${slug}.png`,
    description: profile.blurb(name),
    details: profile.details,
    care: profile.care,
    delivery,
  };
});

export const collections = [
  {
    slug: "men",
    title: "Men's Clothing",
    blurb: "Tees, polos, shirts, denim & jackets",
    image: "/images/oxford-shirt.png",
  },
  {
    slug: "women",
    title: "Women's Clothing",
    blurb: "Tops, kurtis, dresses & co-ords",
    image: "/images/cotton-kurti.png",
  },
  {
    slug: "footwear",
    title: "Footwear",
    blurb: "Sneakers, sandals, slides & boots",
    image: "/images/canvas-sneakers.png",
  },
  {
    slug: "bags",
    title: "Bags & Accessories",
    blurb: "Handbags, totes, wallets & more",
    image: "/images/premium-leather-handbag.png",
  },
];

export function getProduct(slug) {
  return products.find((product) => product.slug === slug);
}

export function getCollection(slug) {
  if (slug === "all") {
    return {
      slug: "all",
      title: "All products",
      blurb: "Men's and women's clothing, footwear, bags and accessories",
      image: "/images/premium-leather-handbag.png",
    };
  }
  return collections.find((collection) => collection.slug === slug);
}

export function productsIn(slug) {
  if (slug === "all") return products;
  return products.filter((product) => product.category === slug);
}

export function collectionStats(slug) {
  const list = productsIn(slug);
  const from = list.reduce((min, product) => Math.min(min, product.price), Infinity);
  return { count: list.length, from: Number.isFinite(from) ? from : 0 };
}

export function relatedProducts(product, limit = 4) {
  const others = products.filter((item) => item.category === product.category && item.slug !== product.slug);
  const cheaper = others.filter((item) => item.price < product.price).sort((a, b) => b.price - a.price);
  const pricier = others.filter((item) => item.price >= product.price).sort((a, b) => a.price - b.price);
  return [...cheaper, ...pricier].slice(0, limit);
}

export function sortProducts(list, sort) {
  const next = list.slice();
  if (sort === "low") next.sort((a, b) => a.price - b.price);
  if (sort === "high") next.sort((a, b) => b.price - a.price);
  return next;
}

export const spotlight = products.find((product) => product.slug === "premium-leather-handbag");

export const faqs = [
  {
    q: "Do you ship across India?",
    a: "Yes, we ship to every serviceable pin code in India. Orders usually arrive within 3–6 business days, and shipping is free on orders over ₹299.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "Unworn items with tags intact can be returned or exchanged within 7 days of delivery.",
  },
  {
    q: "How do I find my size?",
    a: "Each product lists its available sizes. Our apparel follows standard Indian sizing and footwear uses UK sizes. Not sure? WhatsApp us your usual size and we'll help.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes, cash on delivery is available on most pin codes, along with UPI, cards and net banking.",
  },
  {
    q: "How should I care for leather bags and shoes?",
    a: "Wipe with a soft dry cloth, keep away from direct sunlight and moisture, and store in the dust bag provided. Condition leather every few months.",
  },
  {
    q: "Can I see the products in person?",
    a: "Call or WhatsApp us to check availability and visit timings at our store.",
  },
];

export const faqsHi = [
  {
    q: "क्या आप पूरे भारत में शिप करते हैं?",
    a: "हाँ, हम भारत के हर सर्विसेबल पिन कोड पर भेजते हैं। ऑर्डर आमतौर पर 3–6 कार्यदिवसों में पहुँचते हैं, और ₹299 से ऊपर शिपिंग मुफ्त है।",
  },
  {
    q: "रिटर्न और एक्सचेंज की नीति क्या है?",
    a: "बिना पहने हुए सामान, टैग के साथ, डिलीवरी के 7 दिनों के अंदर रिटर्न या एक्सचेंज किया जा सकता है।",
  },
  {
    q: "मैं अपना साइज़ कैसे चुनूँ?",
    a: "हर प्रोडक्ट पर उपलब्ध साइज़ लिखे हैं। कपड़ों में स्टैंडर्ड इंडियन साइज़िंग है और फुटवियर UK साइज़ में है। पक्का न हो तो WhatsApp पर अपना रोज का साइज़ भेजें।",
  },
  {
    q: "क्या कैश ऑन डिलीवरी उपलब्ध है?",
    a: "हाँ, ज़्यादातर पिन कोड पर कैश ऑन डिलीवरी उपलब्ध है, साथ में UPI, कार्ड और नेट बैंकिंग भी।",
  },
  {
    q: "लेदर बैग और जूतों की देखभाल कैसे करें?",
    a: "नरम सूखे कपड़े से पोंछें, सीधी धूप और नमी से दूर रखें, और दिए गए डस्ट बैग में स्टोर करें। हर कुछ महीनों में लेदर को कंडीशन करें।",
  },
  {
    q: "क्या मैं प्रोडक्ट खुद देख सकता हूँ?",
    a: "स्टोर पर उपलब्धता और विज़िट का समय जानने के लिए कॉल या WhatsApp करें।",
  },
];
