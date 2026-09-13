import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Lock, CreditCard, Truck } from "lucide-react";
import PaymentGateway from "./Payment";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore, cartSelectors } from "../store/useCartStore";
import { useOrdersStore, newOrderId } from "../store/useOrdersStore";
import { formatINR } from "../data/fabrics";
import type { Address, Order } from "../types";

interface CheckoutForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function Checkout() {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const savedAddresses = useAuthStore((s) => s.addresses);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);

  const defaultAddress = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];

  const [showPayment, setShowPayment] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    firstName: defaultAddress?.firstName ?? "",
    lastName: defaultAddress?.lastName ?? "",
    address: defaultAddress?.address ?? "",
    city: defaultAddress?.city ?? "",
    postalCode: defaultAddress?.postalCode ?? "",
  });

  const subtotal = cartSelectors.subtotal(items);
  const deliveryFee = subtotal > 0 ? 199 : 0;
  const total = subtotal + deliveryFee;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".checkout-left > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".checkout-summary", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const placeOrder = () => {
    setFormError(null);

    if (!isAuthenticated || !user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    if (
      !form.email ||
      !form.phone ||
      !form.firstName ||
      !form.lastName ||
      !form.address ||
      !form.city ||
      !form.postalCode
    ) {
      setFormError(
        "Please fill in all contact and shipping address fields before placing your order."
      );
      return;
    }
    if (items.length === 0) {
      setFormError("Your cart is empty. Add a product before checking out.");
      return;
    }

    const shippingAddress: Address = {
      id: "checkout",
      label: "Checkout",
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      phone: form.phone,
      isDefault: false,
    };

    const order: Order = {
      id: newOrderId(),
      placedAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        fabricName: i.fabricName,
        fit: i.fit,
      })),
      subtotal,
      deliveryFee,
      total,
      shippingAddress,
      status: "Ordered",
      timeline: [{ status: "Ordered", at: new Date().toISOString() }],
      userEmail: user.email,
    };

    addOrder(order);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    navigate("/dashboard", { state: { orderPlaced: true } });
  };

  const update = (k: keyof CheckoutForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const inputClass = "input";

  return (
    <section
      ref={pageRef}
      className="bg-[#FAF9F6] min-h-screen text-gray-900"
    >
      <div className="container mx-auto px-6 py-24 max-w-7xl">

        {/* ===== Header ===== */}
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
            Secure Checkout
          </p>
          <h1 className="text-4xl lg:text-6xl font-serif mb-6">
            Complete Your
            <span className="text-[#D4AF37] italic"> Order</span>
          </h1>
          <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6">
            Your garment will be handcrafted after payment confirmation.
          </p>
        </div>

        {/* ===== Main Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

          {/* ===== LEFT: FORMS ===== */}
          <div className="checkout-left lg:col-span-2 space-y-16">

            {/* Login notice */}
            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 px-6 py-4 text-sm text-yellow-800">
                You need to{" "}
                <button
                  onClick={() =>
                    navigate("/login", { state: { from: "/checkout" } })
                  }
                  className="underline text-[#D4AF37] font-medium"
                >
                  sign in
                </button>{" "}
                before placing your order.
              </div>
            )}

            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  placeholder="Email address"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                <input
                  placeholder="Phone number"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  placeholder="First name"
                  className={inputClass}
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
                <input
                  placeholder="Last name"
                  className={inputClass}
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
                <input
                  placeholder="Address"
                  className={`${inputClass} md:col-span-2`}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
                <input
                  placeholder="City"
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
                <input
                  placeholder="Postal code"
                  className={inputClass}
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                />
              </div>

              {savedAddresses.length > 0 && !defaultAddress && (
                <p className="text-xs text-gray-500 mt-4">
                  Tip: manage your default address from your{" "}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Dashboard
                  </button>
                  .
                </p>
              )}
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Delivery Method</h3>
              <div className="border border-[#D4AF37]/30 p-6 flex items-center gap-4">
                <Truck className="text-[#D4AF37]" />
                <div>
                  <p className="font-medium">Standard Tailored Delivery</p>
                  <p className="text-sm text-gray-500">
                    Estimated 12–15 days · {formatINR(deliveryFee)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Payment Method</h3>
              <div className="border border-gray-300 p-6 flex items-center gap-4">
                <CreditCard className="text-[#D4AF37]" />
                <p className="text-sm text-gray-600">
                  Card, UPI & Net Banking (demo payment gateway)
                </p>
              </div>
            </div>

          </div>

          {/* ===== RIGHT: SUMMARY ===== */}
          <div className="checkout-summary sticky top-32 h-fit bg-white border border-gray-200 shadow-md p-10">

            <h4 className="text-xl font-serif mb-8">
              Order Summary
            </h4>

            <div className="space-y-5 mb-8">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Your cart is empty. Add a product before checking out.
                </p>
              ) : (
                items.map((item) => {
                  const unit = item.unitPrice + (item.fabricPrice ?? 0);
                  return (
                    <div key={item.productId} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.fabricName ?? "Standard Fabric"}
                          {item.fit ? ` · ${item.fit} Fit` : ""} · Qty{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {formatINR(unit * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold border-t pt-6 mb-10">
              <span>Total</span>
              <span className="text-[#D4AF37]">
                {formatINR(total)}
              </span>
            </div>

            {formError && (
              <div className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {formError}
              </div>
            )}

            <button
              onClick={placeOrder}
              className="w-full bg-[#D4AF37] text-white py-4 text-sm tracking-wide hover:opacity-90 transition"
            >
              Place Order
            </button>

            <PaymentGateway
              isOpen={showPayment}
              onClose={() => setShowPayment(false)}
              amount={total.toLocaleString("en-IN")}
              onSuccess={handlePaymentSuccess}
            />

            <p className="flex items-center gap-2 text-xs text-gray-500 mt-6">
              <Lock size={14} className="text-[#D4AF37]" />
              Secure & encrypted payment
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}