import casualShirt from "../assets/casual-shirt.jpg";
import heroImg from "../assets/hero-image-01.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNum: number;
  description: string;
  image: string;
  details: string[];
  tags?: string[];
}

export const categories = [
  {
    id: "suits",
    title: "The Bespoke Suit",
    desc: "Experience the pinnacle of tailoring with our signature hand-canvassed suits.",
    image: heroImg,
    link: "/collections/shirts",
  },
  {
    id: "shirts",
    title: "Artisanal Shirts",
    desc: "Hand-cut from the world's finest mills, designed for a perfect silhouette.",
    image: casualShirt,
    link: "/collections/shirts",
  },
  {
    id: "wedding",
    title: "Wedding Wear",
    desc: "Command presence on your special day with masterfully crafted ceremonial attire.",
    image: heroImg,
    link: "/collections/shirts",
  },
  {
    id: "formal",
    title: "Formalwear",
    desc: "Timeless elegance for the modern gentleman's evening wardrobe.",
    image: heroImg,
    link: "/collections/shirts",
  },
  {
    id: "casual",
    title: "Casual Tailoring",
    desc: "Relaxed structures meeting premium fabrics for elevated everyday wear.",
    image: heroImg,
    link: "/collections/shirts",
  },
  {
    id: "custom",
    title: "Custom Design",
    desc: "Your vision, our craftsmanship. Completely unique pieces made to order.",
    image: heroImg,
    link: "/collections/shirts",
  },
];

export const products: Product[] = [
  {
    id: "oxford-white",
    name: "Oxford White",
    category: "shirts",
    price: "₹2,999",
    priceNum: 2999,
    description:
      "Crafted from premium Egyptian cotton with a refined structure, this shirt balances elegance and everyday comfort.",
    image: casualShirt,
    tags: ["Casual", "Premium"],
    details: [
      "100% Egyptian Cotton",
      "Breathable & wrinkle-resistant",
      "Hand-finished cuffs & collar",
      "Delivery in 7–10 business days",
    ],
  },
  {
    id: "classic-blue",
    name: "Classic Blue",
    category: "shirts",
    price: "₹3,499",
    priceNum: 3499,
    description:
      "A timeless blue shirt woven from fine poplin, perfect for boardrooms and evening dinners alike.",
    image: casualShirt,
    tags: ["Formal", "Casual"],
    details: [
      "100% Egyptian Cotton Poplin",
      "Slim fit with modern cut",
      "Reinforced mother-of-pearl buttons",
      "Delivery in 7–10 business days",
    ],
  },
  {
    id: "formal-black",
    name: "Formal Black",
    category: "shirts",
    price: "₹3,999",
    priceNum: 3999,
    description:
      "Deep black twill fabric with a subtle sheen, designed for the most distinguished occasions.",
    image: casualShirt,
    tags: ["Formal", "Premium"],
    details: [
      "Italian Cotton Twill",
      "Formal spread collar",
      "French placket with hidden buttons",
      "Delivery in 7–10 business days",
    ],
  },
  {
    id: "linen-beige",
    name: "Linen Beige",
    category: "shirts",
    price: "₹3,299",
    priceNum: 3299,
    description:
      "Lightweight Belgian linen that breathes with you, ideal for summer soirées and coastal getaways.",
    image: casualShirt,
    tags: ["Casual"],
    details: [
      "Belgian Linen Blend",
      "Relaxed fit for airflow",
      "Button-down collar",
      "Delivery in 7–10 business days",
    ],
  },
  {
    id: "striped-business",
    name: "Striped Business",
    category: "shirts",
    price: "₹3,699",
    priceNum: 3699,
    description:
      "Refined pinstripes on premium cotton, engineered for the modern professional's daily rotation.",
    image: casualShirt,
    tags: ["Formal"],
    details: [
      "100% Egyptian Cotton",
      "Regular fit with back darts",
      "Striped pattern with contrast stitching",
      "Delivery in 7–10 business days",
    ],
  },
  {
    id: "signature-custom",
    name: "Signature Custom",
    category: "shirts",
    price: "From ₹4,999",
    priceNum: 4999,
    description:
      "Your design, our master tailors. Fully customizable from fabric to monogram, made to your exact measurements.",
    image: casualShirt,
    tags: ["Premium", "Custom"],
    details: [
      "Choice of 50+ premium fabrics",
      "Made-to-measure with AI precision",
      "Custom monogramming available",
      "Delivery in 10–14 business days",
    ],
  },
];

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
}