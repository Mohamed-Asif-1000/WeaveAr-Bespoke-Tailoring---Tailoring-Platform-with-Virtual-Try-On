import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, cartSelectors, lineTotal } from "../store/useCartStore";
import { formatINR } from "../data/fabrics";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = cartSelectors.subtotal(items);
  const deliveryFee = subtotal > 0 ? 199 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      <section className="bg-[#FAF9F6] text-gray-900 min-h-dvh">
        {/* Hero */}
        <div className="bg-[#1A1A1A] text-[#FAF9F6]">
          <div className="container mx-auto px-6 py-28 max-w-5xl">
            <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-serif">
              Your Selection
            </p>
            <h1 className="text-5xl lg:text-7xl font-serif mb-8">Shopping Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20 max-w-6xl">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag
                size={48}
                strokeWidth={1}
                className="mx-auto mb-6 text-gray-300"
              />
              <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Explore our collection and add tailored pieces you love.
              </p>
              <Link
                to="/collections/shirts"
                className="inline-block bg-[#1A1A1A] text-[#D4AF37] px-10 py-4 text-xs tracking-[4px] uppercase hover:opacity-90 transition-opacity"
              >
                Explore Shirts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-6"
                  >
                    <Link to={`/product/${item.productId}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-36 object-cover border"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-lg font-serif hover:text-[#D4AF37] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.fabricName ?? "Standard Fabric"}
                            {item.fit ? ` · ${item.fit} Fit` : ""}
                          </p>
                          {(item.measurements?.chest ||
                            item.measurements?.waist) && (
                            <p className="text-xs text-gray-400 mt-1">
                              Chest {item.measurements.chest}cm · Waist{" "}
                              {item.measurements.waist}cm
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition"
                            title="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-3 py-2 hover:bg-gray-100 transition"
                            title="Increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold">
                            {formatINR(item.unitPrice + (item.fabricPrice ?? 0))}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {formatINR(lineTotal(item))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="h-fit sticky top-32 bg-white border border-gray-200 shadow-md p-10">
                <h4 className="text-xl font-serif mb-8">Order Summary</h4>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-semibold border-t pt-6 mb-8">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">{formatINR(total)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="block text-center bg-[#D4AF37] text-white py-4 text-sm tracking-[3px] uppercase hover:opacity-90 transition"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/collections/shirts"
                  className="block text-center border border-gray-300 py-4 text-sm tracking-[3px] uppercase text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition mt-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}