import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, Heart, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withMotion } from "../utils/motion";
import type { Product } from "../data/products";

// Your imports
import Suits from "../assets/suit-01.jpg"
import Shirts from "../assets/shirt-01.jpg"
import WeddingWear from "../assets/wedding-wear-01.jpg"
import Formalwear from "../assets/formal-wear-01.jpg"
import CasualTailoring from "../assets/custome-tailoring-01.jpg"
import CustomeDesign from "../assets/custome-design-01.jpg"

gsap.registerPlugin(ScrollTrigger);

export default function Collections() {
  const sectionRef = useRef(null);

  // Data array with assigned images
  const collections = [
    {
      title: "The Bespoke Suit",
      desc: "Experience the pinnacle of tailoring with our signature hand-canvassed suits.",
      image: Suits,
      link: "/category/bespoke-suit"
    },
    {
      title: "Artisanal Shirts",
      desc: "Hand-cut from the world's finest mills, designed for a perfect silhouette.",
      image: Shirts,
      link: "/category/artisanal-shirt"
    },
    {
      title: "Wedding Wear",
      desc: "Command presence on your special day with masterfully crafted ceremonial attire.",
      image: WeddingWear,
      link: "/category/wedding-wear"
    },
    {
      title: "Formalwear",
      desc: "Timeless elegance for the modern gentleman's evening wardrobe.",
      image: Formalwear,
      link: "/category/formal-wear"
    },
    {
      title: "Casual Tailoring",
      desc: "Relaxed structures meeting premium fabrics for elevated everyday wear.",
      image: CasualTailoring,
      link: "/category/casual-tailoring"
    },
    {
      title: "Custom Design",
      desc: "Your vision, our craftsmanship. Completely unique pieces made to order.",
      image: CustomeDesign,
      link: "/category/custom-design"
    }
  ];

  useLayoutEffect(() => {
    return withMotion(sectionRef.current, () => {
      gsap.from(".collection-card", {
        scrollTrigger: {
          trigger: ".collections-grid",
          start: "top 90%",
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    });
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="bg-[#2D2A26] text-[#FAF9F6] overflow-hidden"
    >
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mb-24">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6">
            The Collections
          </p>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">
            Curated Excellence <br />
            <span className="italic text-[#D4AF37]">For Every Occasion</span>
          </h2>
        </div>

        <div className="collections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {collections.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="collection-card group relative block aspect-4/5 overflow-hidden bg-[#1A1A1A]"
            >
              {/* ===== Background Image with Hover Effect ===== */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              </div>

          {/* ===== Content ===== */}
          <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
            <h3 className="text-3xl mb-4 font-serif tracking-wide leading-none">
                  {item.title}
                </h3>

                <p className="text-[#FAF9F6]/60 text-sm leading-relaxed mb-8 max-w-62.5 group-hover:text-[#FAF9F6] transition-colors duration-500">
                  {item.desc}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-xs tracking-[3px] uppercase text-[#D4AF37] relative overflow-hidden">
                    Explore
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-[#D4AF37] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500"></span>
                  </span>
                  <div className="w-0 h-px bg-[#D4AF37] group-hover:w-8 transition-all duration-500"></div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductCardTileProps {
  product: Product;
  isWishlisted: boolean;
  addedToCart: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string) => void;
  onTryOn: (product: Product) => void;
}

export function ProductCardTile({
  product,
  isWishlisted,
  addedToCart,
  onAddToCart,
  onToggleWishlist,
  onTryOn,
}: ProductCardTileProps) {
  const isComingSoon = product.category !== "artisanal-shirt";
  const isAvailable = !isComingSoon && product.inStock;
  const disabledClass = "cursor-not-allowed opacity-40";

  return (
    <div
      className={`category-card group border transition-colors ${
        isComingSoon
          ? "border-gray-300 bg-[#E9E7E2]"
          : "border-gray-200 hover:border-[#D4AF37]/40 bg-white"
      }`}
    >
      <div className="relative h-80 overflow-hidden">
        {isAvailable ? (
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </Link>
        ) : (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover grayscale opacity-45"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#1A1A1A]/45" />
          </>
        )}

        {(isComingSoon || !product.inStock) && (
          <span className="absolute top-5 left-5 bg-[#1A1A1A] text-[#D4AF37] px-4 py-2 text-[10px] tracking-[3px] uppercase z-10">
            {isComingSoon ? "Coming Soon" : "Out of Stock"}
          </span>
        )}
      </div>

      <div className={`p-8 ${isComingSoon ? "text-gray-700" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          {isAvailable ? (
            <Link to={`/product/${product.id}`} className="flex-1">
              <h3 className="text-lg font-serif mb-2 tracking-wide">
                {product.name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-lg font-serif mb-2 tracking-wide flex-1">
              {product.name}
            </h3>
          )}

          {isComingSoon && (
            <span className="text-[10px] tracking-[2px] uppercase text-gray-500 shrink-0">
              Planned
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-gray-600 mb-5">
          {product.description}
        </p>
        <p className="text-gray-700 font-medium mb-6">{product.price}</p>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => {
              if (isAvailable) onAddToCart(product);
            }}
            className={`min-h-10 px-4 py-3 text-[10px] tracking-[2px] uppercase flex items-center justify-center gap-2 transition ${
              isAvailable
                ? "bg-[#D4AF37] text-white hover:opacity-90"
                : `bg-gray-400 text-gray-600 ${disabledClass}`
            }`}
            title={isAvailable ? "Add to cart" : "This service will be available soon"}
          >
            <ShoppingBag size={15} />
            {addedToCart ? "Added" : "Add to Cart"}
          </button>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => {
              if (isAvailable) onToggleWishlist(product.id);
            }}
            className={`min-h-10 px-4 py-3 text-[10px] tracking-[2px] uppercase flex items-center justify-center gap-2 border transition ${
              isAvailable
                ? "border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                : `border-gray-400 text-gray-500 ${disabledClass}`
            }`}
            title={isAvailable ? "Add to wishlist" : "This service will be available soon"}
            aria-label={isAvailable ? "Add to wishlist" : "Coming soon"}
          >
            <Heart
              size={15}
              className={isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : ""}
            />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </button>

          {isAvailable ? (
            <Link
              to={`/try-on-preview/${product.id}`}
              onClick={() => onTryOn(product)}
              className="min-h-10 px-4 py-3 text-[10px] tracking-[2px] uppercase flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#D4AF37] hover:bg-[#2D2A26] transition"
            >
              <Camera size={15} />
              Virtual Try-On
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className={`min-h-10 px-4 py-3 text-[10px] tracking-[2px] uppercase flex items-center justify-center gap-2 border border-gray-400 text-gray-500 ${disabledClass}`}
              title="This service will be available soon"
            >
              <Camera size={15} />
              Try-On
            </button>
          )}
        </div>

        {isComingSoon && (
          <p className="mt-4 text-xs text-gray-500 italic">
            This service will be available soon.
          </p>
        )}
      </div>
    </div>
  );
}
