import { useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { withMotion } from "../utils/motion";

import FabricImg from "../assets/hero-image-01.jpg";
import { fabrics } from "../data/fabrics";
import { useCustomizationStore } from "../store/useCustomizationStore";

export default function FabricSelection() {
  const sectionRef = useRef(null);
  const [selected, setSelected] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const setFabric = useCustomizationStore((s) => s.setFabric);
  const setProduct = useCustomizationStore((s) => s.setProduct);

  useLayoutEffect(() => {
    return withMotion(sectionRef.current, () => {
      gsap.from(".fabric-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    });
  }, []);

  const fabricsList = fabrics;

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] min-h-dvh text-gray-900"
    >
      <div className="container mx-auto px-6 py-28 max-w-6xl">

        {/* ===== Header ===== */}
        <div className="max-w-4xl mb-24">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
            Fabric Selection
          </p>

          <h1 className="text-4xl lg:text-6xl font-serif mb-6">
            Choose Your Fabric
          </h1>

          <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6 max-w-2xl">
            The fabric defines how your garment feels, drapes, and lasts.
            Each option is hand-selected from the world’s finest mills.
          </p>
        </div>

        {/* ===== Fabric Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {fabricsList.map((fabric, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(index);
                setFabric(fabric);
                if (id) setProduct(id);
              }}
              className={`fabric-card group cursor-pointer border transition-all duration-500
                ${
                  selected === index
                    ? "border-[#D4AF37] bg-white shadow-lg"
                    : "border-gray-200 bg-white hover:border-[#D4AF37]/50"
                }`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={FabricImg}
                  alt={fabric.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/20"></div>

                {selected === index && (
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-xs px-4 py-1 tracking-widest">
                    SELECTED
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-serif text-xl mb-2">
                  {fabric.name}
                </h3>

                <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] mb-4">
                  {fabric.category}
                </p>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>Weave: {fabric.weave}</p>
                  <p>Weight: {fabric.weight}</p>
                  <p>Origin: {fabric.origin}</p>
                  <p className="font-medium text-gray-900">
                    {fabric.price === 0 ? "Included" : `+₹${fabric.price.toLocaleString("en-IN")}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Bottom Actions ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Back to Product Details */}
          <Link
            to={`/product/${id}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to Product Details
          </Link>

          {/* Continue to Measurements */}
          <Link
            to={`/measurements/${id}`}
            className={`px-16 py-4 text-sm tracking-wide transition
              ${
                selected !== null
                  ? "bg-[#D4AF37] text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 pointer-events-none"
              }`}
          >
            Continue to Measurements
          </Link>
        </div>

      </div>
    </section>
  );
}
