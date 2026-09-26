import { useState, useLayoutEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { withMotion } from "../utils/motion";
import { useCustomizationStore } from "../store/useCustomizationStore";

interface Measurements {
  chest: string;
  shoulderWidth: string;
  sleeveLength: string;
  neck: string;
  waist: string;
  hip: string;
  shirtLength: string;
  armhole: string;
}

const EMPTY_MEASUREMENTS: Measurements = {
  chest: "",
  shoulderWidth: "",
  sleeveLength: "",
  neck: "",
  waist: "",
  hip: "",
  shirtLength: "",
  armhole: "",
};

export default function ManualMeasurements() {
  const sectionRef = useRef(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const saveFit = useCustomizationStore((s) => s.setFit);
  const saveMeasurements = useCustomizationStore((s) => s.setMeasurements);
  const [step, setStep] = useState(1);
  const [selectedFit, setSelectedFit] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>(EMPTY_MEASUREMENTS);

  useLayoutEffect(() => {
    return withMotion(sectionRef.current, () => {
      gsap.from(".measure-step", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });
  }, [step]);

  const updateMeasurement = (key: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (selectedFit) {
      saveFit(selectedFit);
      saveMeasurements(measurements);
      navigate(`/measurements/review/${id}`, {
        state: { fit: selectedFit, measurements },
      });
    }
  };

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37]";

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] min-h-dvh text-gray-900"
    >
      <div className="container mx-auto px-6 py-28 max-w-4xl">

        {/* ===== Header ===== */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
            Manual Measurement
          </p>
          <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6 max-w-2xl">
            Follow the guided steps below. If unsure, keep a measuring tape
            handy — all entries are reviewed by our tailoring experts.
          </p>
        </div>

        {/* ===== Progress Indicator ===== */}
        <div className="flex items-center gap-6 mb-16">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-semibold
                ${step >= s ? "border-[#D4AF37] text-[#D4AF37]" : "border-gray-300 text-gray-400"}`}
              >
                {s}
              </div>
              {s !== 3 && (
                <div className={`w-12 h-px ${step > s ? "bg-[#D4AF37]" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ===== FORM CARD ===== */}
        <div className="measure-step bg-white border border-gray-200 p-12">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-serif mb-8">Upper Body Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { key: "chest", label: "Chest" },
                  { key: "shoulderWidth", label: "Shoulder Width" },
                  { key: "sleeveLength", label: "Sleeve Length" },
                  { key: "neck", label: "Neck" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 mb-2">{label} (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={measurements[key as keyof Measurements]}
                      onChange={(e) => updateMeasurement(key as keyof Measurements, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-serif mb-8">Lower Body Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { key: "waist", label: "Waist" },
                  { key: "hip", label: "Hip" },
                  { key: "shirtLength", label: "Shirt Length" },
                  { key: "armhole", label: "Armhole" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 mb-2">{label} (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={measurements[key as keyof Measurements]}
                      onChange={(e) => updateMeasurement(key as keyof Measurements, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-serif mb-6">Fit Preference</h2>
              <p className="text-gray-600 mb-8">Choose how you'd like your garment to feel.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Slim", "Regular", "Relaxed"].map((fit) => (
                  <button
                    key={fit}
                    onClick={() => setSelectedFit(fit)}
                    className={`border py-6 text-sm tracking-wide uppercase transition-all ${
                      selectedFit === fit
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                        : "border-gray-300 text-gray-500 hover:border-[#D4AF37]"
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ===== Navigation ===== */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-900 transition"
          >
            ← Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-[#D4AF37] text-white px-10 py-3 text-sm tracking-wide hover:opacity-90 transition shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!selectedFit}
              className={`px-10 py-3 text-sm tracking-wide transition shadow-md ${
                selectedFit
                  ? "bg-[#1A1A1A] text-white hover:opacity-90 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save Measurements
            </button>
          )}
        </div>
      </div>
    </section>
  );
}