import { Link, useParams } from "react-router-dom";
import { Ruler, Camera } from "lucide-react";

export default function Measurements() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="bg-[#FAF9F6] text-gray-900 min-h-dvh">
      <div className="container mx-auto px-6 py-32 max-w-5xl">

        {/* Header */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[6px] uppercase text-gray-500 mb-6 font-serif">
            Measurements
          </p>

          <h1 className="text-4xl lg:text-6xl font-serif mb-6 leading-tight">
            Choose Your
            <span className="text-[#D4AF37] italic"> Measurement Method</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl border-l border-[#D4AF37]/30 pl-6">
            Accurate measurements ensure a flawless fit. Select the method
            you’re most comfortable with.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Manual Measurements */}
          <Link
            to={`/measurements/manual/${id}`}
            className="group border border-gray-200 bg-white p-12 hover:border-[#D4AF37]/60 transition-all"
          >
            <Ruler
              size={40}
              className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform"
            />

            <h3 className="text-2xl font-serif mb-4">
              Manual Measurement
            </h3>

            <p className="text-gray-600 leading-relaxed mb-10">
              Enter your body measurements with guided instructions. Ideal if
              you already know your sizing.
            </p>

            <span className="text-xs tracking-[3px] uppercase text-[#D4AF37] relative">
              Continue
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>

          {/* Virtual Try-On */}
          <Link
            to={`/try-on-preview/${id}`}
            className="group border border-gray-200 bg-[#1A1A1A] p-12 text-[#FAF9F6] hover:border-[#D4AF37]/60 transition-all"
          >
            <Camera
              size={40}
              className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform"
            />

            <h3 className="text-2xl font-serif mb-4">
              Virtual Try-On
            </h3>

            <p className="text-[#FAF9F6]/70 leading-relaxed mb-10">
              Use your camera for AI-powered measurement and live garment
              preview.
            </p>

            <span className="text-xs tracking-[3px] uppercase text-[#D4AF37] relative">
              Start Try-On
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
