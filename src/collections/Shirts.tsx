import { useLayoutEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "../data/products";
import { useWishlistStore } from "../store/useWishlistStore";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["All", "Formal", "Casual", "Premium", "Custom"];

export default function Shirts() {
  const sectionRef = useRef(null);
  const { toggleItem, items } = useWishlistStore();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = (searchParams.get("search") ?? "").trim();
  const shirtProducts = products.filter((p) => p.category === "shirts");

  const filtered = shirtProducts.filter((p) => {
    const matchesTag =
      activeFilter === "All" || (p.tags ?? []).includes(activeFilter);
    if (!matchesTag) return false;
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(lower) ||
      p.price.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      (p.details ?? []).some((d) => d.toLowerCase().includes(lower))
    );
  });

  const clearSearch = () => {
    setSearchParams({});
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".shirt-card", {
        scrollTrigger: {
          trigger: ".shirts-grid",
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] text-gray-900 overflow-hidden"
    >
      {/* ================= HERO ================= */}
      <div className="bg-[#1A1A1A] text-[#FAF9F6]">
        <div className="container mx-auto px-6 py-32 max-w-5xl">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-serif">
            Collection
          </p>

          <h1 className="text-5xl lg:text-7xl font-serif mb-8">
            Tailored Shirts
          </h1>

          <p className="text-[#FAF9F6]/70 text-xl border-l border-[#D4AF37]/30 pl-6 max-w-2xl">
            Precision-crafted shirts designed for comfort, structure, and
            effortless elegance.
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
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

      {/* ================= PRODUCT GRID ================= */}
      <div className="container mx-auto px-6 py-24">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-serif mb-4 text-gray-800">
              No shirts found
            </h3>
            <p className="text-gray-500 mb-8">
              {searchQuery
                ? `Nothing matched "${searchQuery}"`
                : "Try a different filter from the options above."}
            </p>
            <button
              onClick={() => {
                setActiveFilter("All");
                clearSearch();
              }}
              className="text-xs tracking-[3px] uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-8 py-3 hover:bg-[#D4AF37] hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="shirts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((shirt) => (
              <div
                key={shirt.id}
                className="shirt-card group border border-gray-200 hover:border-[#D4AF37]/40 transition-colors bg-white"
              >
                <Link to={`/product/${shirt.id}`}>
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={shirt.image}
                      alt={shirt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                </Link>

                <div className="p-8 flex items-start justify-between">
                  <Link to={`/product/${shirt.id}`} className="flex-1">
                    <h3 className="text-lg font-serif mb-2 tracking-wide">
                      {shirt.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">{shirt.price}</p>

                    <div className="flex items-center gap-4">
                      <span className="text-xs tracking-[3px] uppercase text-[#D4AF37] relative">
                        View Details
                        <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
                      </span>
                      <div className="h-px w-6 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleItem(shirt.id)}
                    className="p-2 hover:scale-110 transition-transform shrink-0"
                    title={
                      items.includes(shirt.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={20}
                      strokeWidth={1.2}
                      className={
                        items.includes(shirt.id)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-gray-400 hover:text-[#D4AF37]"
                      }
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}