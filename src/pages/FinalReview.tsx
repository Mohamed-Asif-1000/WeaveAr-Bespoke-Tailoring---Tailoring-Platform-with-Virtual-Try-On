import { useLayoutEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { Edit, CheckCircle, Truck } from "lucide-react";
import { products } from "../data/products";
import { DEFAULT_FABRIC, formatINR } from "../data/fabrics";
import { useCustomizationStore } from "../store/useCustomizationStore";
import { useCartStore } from "../store/useCartStore";

export default function FinalReview() {
  const sectionRef = useRef(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storeFabric = useCustomizationStore((s) => s.fabric);
  const storeFit = useCustomizationStore((s) => s.fit);
  const storeMeasurements = useCustomizationStore((s) => s.measurements);
  const storeProductId = useCustomizationStore((s) => s.productId);
  const resetCustomization = useCustomizationStore((s) => s.reset);

  const addItem = useCartStore((s) => s.addItem);

  const product =
    products.find((p) => p.id === storeProductId || p.id === id) ?? products[0];

  const fabric = storeFabric ?? DEFAULT_FABRIC;
  const fit = storeFit ?? "Regular";
  const measurements = storeMeasurements;

  const basePrice = product.priceNum;
  const fabricUpgrade = fabric.price;
  const total = basePrice + fabricUpgrade;

  const measurementRows = measurements
    ? [
        { label: "Chest", value: measurements.chest },
        { label: "Shoulder", value: measurements.shoulderWidth },
        { label: "Sleeve", value: measurements.sleeveLength },
        { label: "Neck", value: measurements.neck },
        { label: "Waist", value: measurements.waist },
        { label: "Hip", value: measurements.hip },
        { label: "Shirt Length", value: measurements.shirtLength },
        { label: "Armhole", value: measurements.armhole },
      ]
    : [];

  const handleProceed = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: basePrice,
      fabricName: fabric.name,
      fabricPrice: fabricUpgrade,
      fit,
      measurements: measurements ?? undefined,
    });
    resetCustomization();
    navigate("/checkout");
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".review-left > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".review-summary", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] min-h-screen text-gray-900"
    >
      <div className="container mx-auto px-6 py-24 max-w-7xl">

        {/* ===== Page Header ===== */}
        <div className="max-w-3xl mb-20">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
            Final Review
          </p>
          <h1 className="text-4xl lg:text-6xl font-serif mb-6">
            Review Your
            <span className="text-[#D4AF37] italic"> Custom Garment</span>
          </h1>
          <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6">
            Please confirm all details before placing your order. Your garment
            will be crafted exactly as reviewed below.
          </p>
        </div>

        {/* ===== Main Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

          {/* ===== LEFT CONTENT ===== */}
          <div className="review-left lg:col-span-2 space-y-16">

            {/* Preview */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-130 object-cover"
              />
              <div className="p-6 flex justify-between items-center">
                <p className="text-xl font-serif">{product.name}</p>
                <p className="text-lg font-semibold text-[#D4AF37]">
                  {formatINR(basePrice)}
                </p>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif">Measurements</h3>
                <Link
                  to={`/measurements/${product.id}`}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-[#D4AF37]"
                >
                  <Edit size={14} /> Edit
                </Link>
              </div>

              {measurementRows.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {measurementRows.map((item) => (
                    <div key={item.label} className="border-l border-[#D4AF37]/30 pl-4">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.value ? `${item.value} cm` : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500">
                  No measurements recorded yet.{" "}
                  <Link
                    to={`/measurements/${product.id}`}
                    className="text-[#D4AF37] hover:underline"
                  >
                    Add your measurements
                  </Link>{" "}
                  to complete your order.
                </div>
              )}
            </div>

            {/* Fabric & Design */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif">Fabric & Design</h3>
                <Link
                  to={`/fabric-selection/${product.id}`}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500 hover:text-[#D4AF37]"
                >
                  <Edit size={14} /> Edit
                </Link>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Fabric:</span> {fabric.name} (
                  {fabric.weave}, {fabric.origin})
                </p>
                <p>
                  <span className="font-medium">Fit:</span> {fit}
                </p>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SUMMARY ===== */}
          <div className="review-summary sticky top-32 h-fit bg-white border border-gray-200 shadow-md p-10">

            <h4 className="text-xl font-serif mb-8">
              Order Summary
            </h4>

            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between items-center">
                <span>{product.name}</span>
                <span>{formatINR(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>
                  Fabric Upgrade{" "}
                  <span className="text-black/60">({fabric.name})</span>
                </span>
                <span>
                  {fabricUpgrade === 0
                    ? "Included"
                    : `+${formatINR(fabricUpgrade)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tailoring</span>
                <span>Included</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold border-t pt-6 mb-8">
              <span>Total</span>
              <span className="text-[#D4AF37]">{formatINR(total)}</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-gray-600 mb-10">
              <Truck size={16} className="text-[#D4AF37]" />
              <p>
                Estimated delivery within <strong>12–15 days</strong> from order
                confirmation.
              </p>
            </div>

            <button
              onClick={handleProceed}
              className="block w-full text-center bg-[#D4AF37] text-white py-4 text-sm tracking-wide hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>

            <p className="flex items-center gap-2 text-xs text-gray-500 mt-6">
              <CheckCircle size={14} className="text-[#D4AF37]" />
              Your measurements are securely saved
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}