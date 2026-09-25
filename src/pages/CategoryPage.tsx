import { useLayoutEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "../data/products";
import { products } from "../data/products";
import { ProductCardTile } from "../components/ProductCard";
import { useCartStore } from "../store/useCartStore";
import { useCustomizationStore } from "../store/useCustomizationStore";
import { useWishlistStore } from "../store/useWishlistStore";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["All", "Formal", "Casual", "Premium", "Custom"];

const CATEGORY_DETAILS: Record<
  string,
  { title: string; description: string }
> = {
  "bespoke-suit": {
    title: "The Bespoke Suit",
    description:
      "Experience the pinnacle of tailoring with our signature hand-canvassed suits.",
  },
  "artisanal-shirt": {
    title: "Artisanal Shirts",
    description:
      "Hand-cut from the world's finest mills, designed for a perfect silhouette.",
  },
  "wedding-wear": {
    title: "Wedding Wear",
    description:
      "Command presence on your special day with masterfully crafted ceremonial attire.",
  },
  "formal-wear": {
    title: "Formal Wear",
    description:
      "Timeless elegance for the modern gentleman's evening wardrobe.",
  },
  "casual-tailoring": {
    title: "Casual Tailoring",
    description:
      "Relaxed structures meeting premium fabrics for elevated everyday wear.",
  },
  "custom-design": {
    title: "Custom Design",
    description:
      "Your vision, our craftsmanship. Completely unique pieces made to order.",
  },
};

export default function CategoryPage() {
  const sectionRef = useRef(null);
  const { category = "" } = useParams<{ category: string }>();
  const { toggleItem, items } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const setCustomProduct = useCustomizationStore((state) => state.setProduct);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categoryDetails = CATEGORY_DETAILS[category];
  const isComingSoon = Boolean(
    categoryDetails && category !== "artisanal-shirt"
  );
  const searchQuery = (searchParams.get("search") ?? "").trim();
  const categoryProducts = categoryDetails
    ? products.filter((product) => product.category === category)
    : [];
  const filtered = categoryProducts.filter((product) => {
    const matchesTag =
      activeFilter === "All" || (product.tags ?? []).includes(activeFilter);
    if (!matchesTag) return false;
    if (!searchQuery) return true;

    const lower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(lower) ||
      product.price.toLowerCase().includes(lower) ||
      product.description.toLowerCase().includes(lower) ||
      (product.details ?? []).some((detail) => detail.toLowerCase().includes(lower))
    );
  });

  const clearSearch = () => {
    setSearchParams({});
  };

  const clearFilters = () => {
    setActiveFilter("All");
    clearSearch();
  };

  const handleAddToCart = (product: Product) => {
    if (product.category !== "artisanal-shirt" || !product.inStock) return;

    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.priceNum,
    });
    setAddedProductId(product.id);
    window.setTimeout(() => {
      setAddedProductId((current) =>
        current === product.id ? null : current
      );
    }, 1800);
  };

  const handleToggleWishlist = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (product?.category !== "artisanal-shirt" || !product.inStock) return;
    toggleItem(id);
  };

  const handleTryOn = (product: Product) => {
    if (product.category !== "artisanal-shirt" || !product.inStock) return;
    setCustomProduct(product.id);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".category-card", {
        scrollTrigger: {
          trigger: ".category-grid",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [category]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] text-gray-900 overflow-hidden"
    >
      <div className="bg-[#1A1A1A] text-[#FAF9F6]">
        <div className="container mx-auto px-6 py-32 max-w-5xl">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] font-serif">
              {isComingSoon ? "Roadmap Collection" : "Collection"}
            </p>
            {isComingSoon && (
              <span className="text-[10px] tracking-[3px] uppercase border border-[#D4AF37]/50 text-[#D4AF37] px-3 py-1">
                Coming Soon
              </span>
            )}
          </div>

          <h1 className="text-5xl lg:text-7xl font-serif mb-8 mt-6">
            {categoryDetails?.title ?? "Collection not found"}
          </h1>

          <p className="text-[#FAF9F6]/70 text-xl border-l border-[#D4AF37]/30 pl-6 max-w-2xl">
            {categoryDetails?.description ?? "This collection is not available."}
          </p>
        </div>
      </div>

      {isComingSoon && (
        <div className="bg-[#2D2A26] text-[#FAF9F6] border-b border-[#D4AF37]/20">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div>
              <p className="text-[10px] tracking-[4px] uppercase text-[#D4AF37] mb-2">
                Planned Feature
              </p>
              <p className="text-sm text-[#FAF9F6]/75">
                This collection is part of our tailoring roadmap. Product previews
                are available, while purchase and try-on features are being prepared.
              </p>
            </div>
            <span className="text-xs tracking-[2px] uppercase text-[#FAF9F6]/50 whitespace-nowrap">
              Not available for purchase yet
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-6 text-sm tracking-widest uppercase">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "text-[#D4AF37] border-b border-[#D4AF37] pb-1 transition-colors"
                  : "text-gray-500 hover:text-[#D4AF37] pb-1 border-b border-transparent transition-colors"
              }
            >
              {filter}
            </button>
          ))}

          {searchQuery && (
            <span className="flex items-center gap-2 text-[#D4AF37] tracking-normal uppercase ml-auto">
              {filtered.length} result{filtered.length === 1 ? "" : "s"} for
              "{searchQuery}"
              <button
                onClick={clearSearch}
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-serif mb-4 text-gray-800">
              {categoryDetails
                ? `No ${categoryDetails.title.toLowerCase()} found`
                : "Category not found"}
            </h3>
            <p className="text-gray-500 mb-8">
              {searchQuery
                ? `Nothing matched "${searchQuery}"`
                : categoryDetails
                  ? "New pieces are coming soon."
                  : "Please choose one of our available collections."}
            </p>
            {categoryDetails && (
              <button
                onClick={clearFilters}
                className="text-xs tracking-[3px] uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-8 py-3 hover:bg-[#D4AF37] hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="category-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((product) => (
              <ProductCardTile
                key={product.id}
                product={product}
                isWishlisted={items.includes(product.id)}
                addedToCart={addedProductId === product.id}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onTryOn={handleTryOn}
              />
            ))}
          </div>
        )}

        {isComingSoon && (
          <div className="mt-16 text-center border border-[#D4AF37]/30 bg-white px-6 py-8">
            <p className="text-[10px] tracking-[4px] uppercase text-[#D4AF37] mb-3">
              Roadmap Preview
            </p>
            <p className="text-lg font-serif text-gray-800">
              We're crafting these premium services. Available soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
