import { useLayoutEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import gsap from "gsap";
import { withMotion } from "../utils/motion";
import { useCustomizationStore } from "../store/useCustomizationStore";

export default function MeasurementReview() {
  const sectionRef = useRef(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const storeFit = useCustomizationStore((s) => s.fit);
  const storeMeasurements = useCustomizationStore((s) => s.measurements);
  const selectedFit = storeFit || location.state?.fit || "Regular";

  const measurements = storeMeasurements || location.state?.measurements || {
    chest: "100 cm",
    shoulderWidth: "46 cm",
    sleeveLength: "62 cm",
    neck: "39 cm",
    waist: "82 cm",
    hip: "96 cm",
    shirtLength: "74 cm",
    armhole: "44 cm",
  };

  const upperBody = [
    ["Chest", measurements.chest],
    ["Shoulder", measurements.shoulderWidth],
    ["Sleeve", measurements.sleeveLength],
    ["Neck", measurements.neck],
  ];

  const lowerBody = [
    ["Waist", measurements.waist],
    ["Hip", measurements.hip],
    ["Shirt Length", measurements.shirtLength],
    ["Armhole", measurements.armhole],
  ];

  useLayoutEffect(() => {
    return withMotion(sectionRef.current, () => {
      gsap.from(".review-block", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] min-h-dvh text-gray-900"
    >
      <div className="container mx-auto px-6 py-28 max-w-5xl">

        {/* ===== Header ===== */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
            Review Details
          </p>

          <h1 className="text-4xl lg:text-5xl font-serif mb-6">
            Confirm Your Measurements
          </h1>

          <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6 max-w-3xl">
            Please review your measurements carefully. Our tailoring experts
            will validate everything before crafting your garment.
          </p>
        </div>

        {/* ===== Review Card ===== */}
        <div className="review-block bg-white border border-gray-200 p-12 mb-16">

          {/* Upper Body */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Upper Body</h2>
              <Link
                to={`/measurements/manual/${id}`}
                className="text-xs tracking-widest uppercase text-[#D4AF37] hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              {upperBody.map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500">{label}</p>
                  <p className="font-medium">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-12" />

          {/* Lower Body */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Lower Body</h2>
              <Link
                to={`/measurements/manual/${id}`}
                className="text-xs tracking-widest uppercase text-[#D4AF37] hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              {lowerBody.map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500">{label}</p>
                  <p className="font-medium">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-12" />

          {/* Fit Preference */}
          <div>
            <h2 className="text-2xl font-serif mb-4">Fit Preference</h2>
            <p className="text-gray-700 text-sm">
              Selected Fit:
              <span className="ml-2 font-semibold text-[#D4AF37] uppercase tracking-wide">
                {selectedFit}
              </span>
            </p>
          </div>
        </div>

        {/* ===== Assurance Strip ===== */}
        <div className="review-block bg-[#1A1A1A] text-[#FAF9F6] p-10 mb-16">
          <p className="text-sm leading-relaxed max-w-3xl">
            Every measurement is reviewed by our master tailors. If anything
            feels off, we'll contact you before production begins — no risk,
            no guesswork.
          </p>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            to={`/measurements/manual/${id}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Edit Measurements
          </Link>

          <Link
            to={`/final-review/${id}`}
            className="bg-[#D4AF37] text-white px-14 py-4 text-sm tracking-wide hover:opacity-90 transition"
          >
            Proceed
          </Link>
        </div>

      </div>
    </section>
  );
}