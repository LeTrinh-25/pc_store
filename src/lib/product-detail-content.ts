export type ProductColorVariant = {
  color: string;
  colorHex: string;
  image: string;
  price: number;
  stock: number;
  capacity?: string;
};
import { productImage } from "@/lib/product-images";

const colorChoices = [
  { color: "\u0110en", colorHex: "#202124" },
  { color: "Tr\u1eafng", colorHex: "#f4f4f5" },
  { color: "Xanh d\u01b0\u01a1ng", colorHex: "#2563eb" },
];

function getCapacities(category: string, name: string): string[] {
  const text = `${category} ${name}`.toLowerCase();
  if (/phone|\u0111i\u1ec7n tho\u1ea1i|iphone|samsung/.test(text)) return ["128GB", "256GB", "512GB"];
  if (/ram|memory/.test(text)) return ["16GB", "32GB", "64GB"];
  if (/ssd|\u1ed5 c\u1ee9ng/.test(text)) return ["500GB", "1TB", "2TB"];
  if (/pc|desktop|laptop/.test(text)) return ["16GB RAM / 512GB SSD", "32GB RAM / 1TB SSD"];
  return [];
}

export function getProductVariants(product: { name: string; price: number; image: string; stock: number }, category: string): ProductColorVariant[] {
  const capacities = getCapacities(category, product.name);
  const options = capacities.length ? capacities : [undefined];
  const priceStep = Math.max(50000, Math.round(product.price * 0.03));
  return colorChoices.flatMap((choice, colorIndex) => options.map((capacity, capacityIndex) => ({
    ...choice,
    capacity,
    price: product.price + colorIndex * priceStep + capacityIndex * priceStep,
    image: product.image || productImage(product.name, category),
    stock: product.stock < 1 || colorIndex === colorChoices.length - 1
      ? 0
      : Math.max(1, Math.ceil(product.stock / (colorIndex + capacityIndex + 1))),
  })));
}

export function getProductDetails(category: string) {
  const text = category.toLowerCase();
  return {
    warranty: text.includes("pc") ? "36 th\u00e1ng (tham kh\u1ea3o)" : "Theo ch\u00ednh s\u00e1ch h\u00e3ng (tham kh\u1ea3o)",
    origin: "Theo nh\u00e0 s\u1ea3n xu\u1ea5t (tham kh\u1ea3o)",
  };
}

export const purchaseNotes = [
  "Ki\u1ec3m tra k\u1ef9 t\u00ean s\u1ea3n ph\u1ea9m v\u00e0 phi\u00ean b\u1ea3n \u0111\u00e3 ch\u1ecdn tr\u01b0\u1edbc khi \u0111\u1eb7t h\u00e0ng.",
  "Th\u1eddi h\u1ea1n b\u1ea3o h\u00e0nh v\u00e0 xu\u1ea5t x\u1ee9 c\u1ea7n \u0111\u01b0\u1ee3c x\u00e1c nh\u1eadn theo th\u00f4ng tin tr\u00ean h\u1ed9p ho\u1eb7c h\u00f3a \u0111\u01a1n.",
  "S\u1ea3n ph\u1ea9m \u0111i\u1ec7n t\u1eed n\u00ean \u0111\u01b0\u1ee3c l\u1eafp \u0111\u1eb7t v\u00e0 s\u1eed d\u1ee5ng theo h\u01b0\u1edbng d\u1eabn c\u1ee7a nh\u00e0 s\u1ea3n xu\u1ea5t.",
];
