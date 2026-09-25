import casualShirt from "../assets/casual-shirt.jpg";
import heroImg from "../assets/hero-image-01.jpg";
import oxfordWhiteShirt from "../assets/oxford-white-shirt.jpg";
import classicBlueShirt from "../assets/classic-blue-shirt.jpg";
import formalBlackShirt from "../assets/formal-black-shirt.jpg";
import classicOxfordSuit from "../assets/classic-oxford-suit.jpg";
import midnightWoolSuit from "../assets/midnight-wool-suit.jpg";
import herringboneTravelSuit from "../assets/herringbone-travel-suit.jpg";
import ivoryWeddingSuit from "../assets/ivory-wedding-suit.jpg";
import royalWeddingEnsemble from "../assets/royal-wedding-ensemble.jpg";
import receptionTuxedo from "../assets/reception-tuxedo.jpg";
import stripedBusinessShirt from "../assets/striped-business.jpg";
import executiveWhiteShirt from "../assets/executive-white-shirt.jpg";
import midnightFormalShirt from "../assets/midnight-formal-shirt.jpg";
import linenBeige from "../assets/linen-beige.jpg";
import oxfordFabric from "../assets/oxford-fabric.jpg";
import customDesign from "../assets/custom-design.jpg";
import personalisedCollar from "../assets/personalised-collar.jpg";
import monogramShirt from "../assets/monogram-shirt.jpg";

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
  inStock: boolean;
}

export const categories = [
  {
    id: "suits",
    title: "The Bespoke Suit",
    desc: "Experience the pinnacle of tailoring with our signature hand-canvassed suits.",
    image: heroImg,
    link: "/category/bespoke-suit",
  },
  {
    id: "shirts",
    title: "Artisanal Shirts",
    desc: "Hand-cut from the world's finest mills, designed for a perfect silhouette.",
    image: casualShirt,
    link: "/category/artisanal-shirt",
  },
  {
    id: "wedding",
    title: "Wedding Wear",
    desc: "Command presence on your special day with masterfully crafted ceremonial attire.",
    image: heroImg,
    link: "/category/wedding-wear",
  },
  {
    id: "formal",
    title: "Formal Wear",
    desc: "Timeless elegance for the modern gentleman's evening wardrobe.",
    image: heroImg,
    link: "/category/formal-wear",
  },
  {
    id: "casual",
    title: "Casual Tailoring",
    desc: "Relaxed structures meeting premium fabrics for elevated everyday wear.",
    image: heroImg,
    link: "/category/casual-tailoring",
  },
  {
    id: "custom",
    title: "Custom Design",
    desc: "Your vision, our craftsmanship. Completely unique pieces made to order.",
    image: heroImg,
    link: "/category/custom-design",
  },
];

export const products: Product[] = [
  {
    id: "oxford-white",
    name: "Oxford White",
    category: "artisanal-shirt",
    price: "₹2,999",
    priceNum: 2999,
    description:
      "Crafted from premium Egyptian cotton with a refined structure, this shirt balances elegance and everyday comfort.",
    image: oxfordWhiteShirt,
    tags: ["Casual", "Premium"],
    details: [
      "100% Egyptian Cotton",
      "Breathable & wrinkle-resistant",
      "Hand-finished cuffs & collar",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "classic-blue",
    name: "Classic Blue",
    category: "artisanal-shirt",
    price: "₹3,499",
    priceNum: 3499,
    description:
      "A timeless blue shirt woven from fine poplin, perfect for boardrooms and evening dinners alike.",
    image: classicBlueShirt,
    tags: ["Formal", "Casual"],
    details: [
      "100% Egyptian Cotton Poplin",
      "Slim fit with modern cut",
      "Reinforced mother-of-pearl buttons",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "formal-black",
    name: "Formal Black",
    category: "artisanal-shirt",
    price: "₹3,999",
    priceNum: 3999,
    description:
      "Deep black twill fabric with a subtle sheen, designed for the most distinguished occasions.",
    image: formalBlackShirt,
    tags: ["Formal", "Premium"],
    details: [
      "Italian Cotton Twill",
      "Formal spread collar",
      "French placket with hidden buttons",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "linen-beige",
    name: "Linen Beige",
    category: "casual-tailoring",
    price: "₹3,299",
    priceNum: 3299,
    description:
      "Lightweight Belgian linen that breathes with you, ideal for summer soirées and coastal getaways.",
    image: linenBeige,
    tags: ["Casual"],
    details: [
      "Belgian Linen Blend",
      "Relaxed fit for airflow",
      "Button-down collar",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "striped-business",
    name: "Striped Business",
    category: "formal-wear",
    price: "₹3,699",
    priceNum: 3699,
    description:
      "Refined pinstripes on premium cotton, engineered for the modern professional's daily rotation.",
    image: stripedBusinessShirt,
    tags: ["Formal"],
    details: [
      "100% Egyptian Cotton",
      "Regular fit with back darts",
      "Striped pattern with contrast stitching",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "signature-custom",
    name: "Signature Custom",
    category: "custom-design",
    price: "From ₹4,999",
    priceNum: 4999,
    description:
      "Your design, our master tailors. Fully customizable from fabric to monogram, made to your exact measurements.",
    image: customDesign,
    tags: ["Premium", "Custom"],
    details: [
      "Choice of 50+ premium fabrics",
      "Made-to-measure with AI precision",
      "Custom monogramming available",
      "Delivery in 10–14 business days",
    ],
    inStock: true,
  },
  {
    id: "101",
    name: "Classic Oxford Suit",
    category: "bespoke-suit",
    price: "₹24,999",
    priceNum: 24999,
    description:
      "A hand-canvassed two-piece suit with a refined Oxford weave and a clean, modern silhouette.",
    image: classicOxfordSuit,
    tags: ["Bespoke", "Premium"],
    details: [
      "Hand-canvassed construction",
      "Italian wool blend",
      "Tailored two-piece silhouette",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "102",
    name: "Midnight Wool Suit",
    category: "bespoke-suit",
    price: "₹32,999",
    priceNum: 32999,
    description:
      "A sharply tailored midnight suit designed for evening occasions and executive celebrations.",
    image: midnightWoolSuit,
    tags: ["Bespoke", "Formal"],
    details: [
      "Super 130s wool",
      "Midnight peak lapel",
      "Hand-finished jacket construction",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "103",
    name: "Herringbone Travel Suit",
    category: "bespoke-suit",
    price: "₹27,999",
    priceNum: 27999,
    description:
      "A resilient herringbone suit with a soft break and tailored structure for journeys that matter.",
    image: herringboneTravelSuit,
    tags: ["Bespoke", "Travel"],
    details: [
      "Performance wool blend",
      "Herringbone pattern",
      "Lightweight tailored lining",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "201",
    name: "Ivory Wedding Suit",
    category: "wedding-wear",
    price: "₹29,999",
    priceNum: 29999,
    description:
      "An ivory ceremonial suit with a graceful silhouette, crafted for the most memorable day.",
    image: ivoryWeddingSuit,
    tags: ["Wedding", "Premium"],
    details: [
      "Ivory wool blend",
      "Ceremony-ready tailoring",
      "Satin peak lapel detail",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "202",
    name: "Royal Wedding Ensemble",
    category: "wedding-wear",
    price: "₹35,999",
    priceNum: 35999,
    description:
      "A refined royal-blue ensemble with structured shoulders and an elegant wedding finish.",
    image: royalWeddingEnsemble,
    tags: ["Wedding", "Bespoke"],
    details: [
      "Royal-blue wool blend",
      "Structured ceremonial cut",
      "Matching formal accessories",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "203",
    name: "Reception Tuxedo",
    category: "wedding-wear",
    price: "₹31,999",
    priceNum: 31999,
    description:
      "A modern reception tuxedo balancing sharp evening tailoring with all-day celebration comfort.",
    image: receptionTuxedo,
    tags: ["Wedding", "Formal"],
    details: [
      "Black wool tuxedo cloth",
      "Satin shawl lapel",
      "Formal shirt pairing included",
      "Delivery in 14–21 business days",
    ],
    inStock: true,
  },
  {
    id: "301",
    name: "Executive White Shirt",
    category: "formal-wear",
    price: "₹3,899",
    priceNum: 3899,
    description:
      "A crisp executive white shirt with a structured collar for important meetings and evening events.",
    image: executiveWhiteShirt,
    tags: ["Formal", "Premium"],
    details: [
      "100% long-staple cotton",
      "Structured French collar",
      "Mother-of-pearl buttons",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "302",
    name: "Midnight Formal Shirt",
    category: "formal-wear",
    price: "₹4,299",
    priceNum: 4299,
    description:
      "A deep midnight formal shirt with a smooth finish and a precise, evening-ready cut.",
    image: midnightFormalShirt,
    tags: ["Formal", "Premium"],
    details: [
      "Midnight cotton twill",
      "Evening spread collar",
      "Reinforced placket",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "401",
    name: "Weekend Oxford",
    category: "casual-tailoring",
    price: "₹2,899",
    priceNum: 2899,
    description:
      "An easygoing Oxford shirt with a soft hand feel and relaxed structure for weekends in motion.",
    image: oxfordFabric,
    tags: ["Casual", "Premium"],
    details: [
      "Soft Oxford cotton",
      "Relaxed button-down collar",
      "Breathable everyday weave",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "402",
    name: "Smart Casual Shirt",
    category: "casual-tailoring",
    price: "₹3,199",
    priceNum: 3199,
    description:
      "A polished smart-casual shirt designed to move between relaxed plans and refined evenings.",
    image: casualShirt,
    tags: ["Casual", "Premium"],
    details: [
      "Cotton-linen blend",
      "Soft tailored fit",
      "Minimal tonal detailing",
      "Delivery in 7–10 business days",
    ],
    inStock: true,
  },
  {
    id: "501",
    name: "Monogram Shirt",
    category: "custom-design",
    price: "₹5,499",
    priceNum: 5499,
    description:
      "A personal monogram shirt made to your specification, with a refined finish reserved for you.",
    image: monogramShirt,
    tags: ["Custom", "Premium"],
    details: [
      "Personalised monogram",
      "Choice of premium cotton",
      "Hand-finished embroidery",
      "Delivery in 10–14 business days",
    ],
    inStock: true,
  },
  {
    id: "502",
    name: "Personalised Collar",
    category: "custom-design",
    price: "₹5,999",
    priceNum: 5999,
    description:
      "A distinctive custom shirt with a personalised collar detail and made-to-order proportions.",
    image: personalisedCollar,
    tags: ["Custom", "Premium"],
    details: [
      "Custom collar detailing",
      "Made-to-order sizing",
      "Premium fabric selection",
      "Delivery in 10–14 business days",
    ],
    inStock: true,
  },
];

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower),
  );
}
