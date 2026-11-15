export const site = {
  name: "Wearveltho",
  url: "https://wearveltho.com",
  phoneDisplay: "+91 97182 68147",
  phoneTel: "+919718268147",
  whatsapp: "919718268147",
  email: "support@wearveltho.com",
  addressLines: [
    "110-I-3 F/F 379, Square Jaina Tower, Distt Centre",
    "Janak Puri, New Delhi, West Delhi, Delhi, 110058",
  ],
  addressOneLine:
    "110-I-3 F/F 379, Square Jaina Tower, Distt Centre, Janak Puri, New Delhi, West Delhi, Delhi, 110058",
  freeShippingOver: 299,
  shippingFee: 99,
  instagram: "#",
  facebook: "#",
};

export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function whatsappLink(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mapsLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.addressOneLine)}`;
}
