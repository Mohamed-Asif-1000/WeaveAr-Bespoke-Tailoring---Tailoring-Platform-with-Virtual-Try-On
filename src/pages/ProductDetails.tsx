import { useLayoutEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Check } from "lucide-react";
import gsap from "gsap";
import { products } from "../data/products";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { useCustomizationStore } from "../store/useCustomizationStore";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { toggleItem, items } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const setCustomProduct = useCustomizationStore((s) => s.setProduct);

  const product = products.find((p) => p.id === id) ?? products[0];
  const isWishlisted = items.includes(product.id);

  const [selectedFabric, setSelectedFabric] = useState("Oxford");
  const [selectedFit, setSelectedFit] = useState("Regular");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.priceNum,
      fabricName: selectedFabric,
      fit: selectedFit,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".product-animate", {
        y: 40,
        opacity: 0,
        duration: 1,
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
      <div className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* ================= IMAGE GALLERY ================= */}
          <div className="product-animate">
            <div className="relative border border-gray-200 bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-150 object-cover"
              />

              {/* Badge */}
              <span className="absolute top-6 left-6 text-[10px] tracking-[4px] uppercase bg-[#1A1A1A] text-[#D4AF37] px-4 py-2">
                Tailored Fit
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-6">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-24 border border-gray-200 overflow-hidden cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div className="flex flex-col gap-10">
            <div className="product-animate">
              <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-4">
                Shirts Collection
              </p>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl lg:text-6xl font-serif mb-6">
                  {product.name} Shirt
                </h1>
                <button
                  onClick={() => toggleItem(product.id)}
                  className="mt-2 p-2 hover:scale-110 transition-transform shrink-0"
                  title={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    size={24}
                    strokeWidth={1.2}
                    className={
                      isWishlisted
                        ? "fill-[#D4AF37] text-[#D4AF37]"
                        : "text-gray-400 hover:text-[#D4AF37]"
                    }
                  />
                </button>
              </div>

              <p className="text-gray-600 text-xl max-w-xl leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="product-animate">
              <span className="text-3xl font-serif">{product.price}</span>
              <p className="text-sm text-gray-500 mt-2">
                Inclusive of all taxes
              </p>
            </div>

            {/* Fabric Options */}
            <div className="product-animate">
              <h4 className="text-xs tracking-[3px] uppercase text-gray-500 mb-4">
                Fabric
              </h4>

              <div className="flex gap-4 flex-wrap">
                {["Oxford", "Poplin", "Twill"].map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`px-6 py-3 border text-sm transition-all ${
                      selectedFabric === fabric
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Fit */}
            <div className="product-animate">
              <h4 className="text-xs tracking-[3px] uppercase text-gray-500 mb-4">
                Fit
              </h4>

              <div className="flex gap-4 flex-wrap">
                {["Slim", "Regular", "Relaxed"].map((fit) => (
                  <button
                    key={fit}
                    onClick={() => setSelectedFit(fit)}
                    className={`px-6 py-3 border text-sm transition-all ${
                      selectedFit === fit
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="product-animate grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className={`min-h-11.5 px-3 py-3 text-[11px] tracking-[2px] uppercase leading-snug text-center flex items-center justify-center gap-2 transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[#D4AF37] text-white hover:opacity-90"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={16} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  navigate("/cart");
                }}
                className="min-h-11.5 px-3 py-3 text-[11px] tracking-[2px] uppercase leading-snug text-center bg-[#1A1A1A] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Buy Now
              </button>

              <Link
                to={`/try-on-preview/${id}`}
                onClick={() => setCustomProduct(product.id)}
                className="min-h-11.5 px-3 py-3 text-[11px] tracking-[2px] uppercase leading-snug text-center bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center hover:bg-[#2D2A26] transition-colors"
              >
                Start Virtual Try-On
              </Link>

              <Link
                to={`/fabric-selection/${id}`}
                onClick={() => setCustomProduct(product.id)}
                className="min-h-11.5 px-3 py-3 text-[11px] tracking-[2px] uppercase leading-snug text-center border border-gray-300 text-gray-700 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              >
                Customize & Select Fabric
              </Link>
            </div>

            {/* Details */}
            <div className="product-animate border-t border-gray-200 pt-10 mt-10">
              <ul className="space-y-4 text-sm text-gray-600">
                {product.details.map((detail, i) => (
                  <li key={i}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
