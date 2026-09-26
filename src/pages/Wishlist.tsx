import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../store/useWishlistStore";
import { products } from "../data/products";

export default function Wishlist() {
  const { items, toggleItem } = useWishlistStore();

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <>
      <section className="bg-[#FAF9F6] text-gray-900 min-h-dvh">
        {/* Hero */}
        <div className="bg-[#1A1A1A] text-[#FAF9F6]">
          <div className="container mx-auto px-6 py-32 max-w-5xl">
            <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-serif">
              Your Collection
            </p>
            <h1 className="text-5xl lg:text-7xl font-serif mb-8">Wishlist</h1>
            <p className="text-[#FAF9F6]/70 text-xl border-l border-[#D4AF37]/30 pl-6 max-w-2xl">
              {wishlistProducts.length > 0
                ? `${wishlistProducts.length} item${wishlistProducts.length > 1 ? "s" : ""} saved for later.`
                : "Start exploring our collections and save pieces you love."}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="container mx-auto px-6 py-24">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart
                size={48}
                strokeWidth={1}
                className="mx-auto mb-6 text-gray-300"
              />
              <h2 className="text-2xl font-serif mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Browse our collections and tap the heart icon to save pieces
                you love.
              </p>
              <Link
                to="/collections/shirts"
                className="inline-block bg-[#1A1A1A] text-[#D4AF37] px-10 py-4 text-xs tracking-[4px] uppercase hover:opacity-90 transition-opacity"
              >
                Explore Shirts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-200 hover:border-[#D4AF37]/40 transition-colors bg-white"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                  </Link>

                  <div className="p-8 flex items-start justify-between">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <h3 className="text-lg font-serif mb-2 tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{product.price}</p>
                    </Link>
                    <button
                      onClick={() => toggleItem(product.id)}
                      className="p-2 hover:scale-110 transition-transform"
                      title="Remove from wishlist"
                    >
                      <Heart
                        size={20}
                        strokeWidth={1.2}
                        className="fill-[#D4AF37] text-[#D4AF37]"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
