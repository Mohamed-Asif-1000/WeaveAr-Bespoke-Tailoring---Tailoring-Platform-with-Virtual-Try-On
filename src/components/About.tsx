import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withMotion } from "../utils/motion";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    return withMotion(containerRef.current, () => {
      // --- PAGE LOAD ANIMATIONS ---
      // Staggered entrance for the Intro section
      gsap.from(".about-intro > *", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });

      // --- SCROLL ANIMATIONS ---
      
      // 1. Pillars Grid: Cards fade in and lift up one by one
      gsap.from(".pillar-card", {
        scrollTrigger: {
          trigger: ".pillars-grid",
          start: "top 85%", // Starts when the top of the grid hits 85% of the viewport
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
      });

      // 2. Craft + Tech Split: Slide in from left and right
      gsap.from(".split-left", {
        scrollTrigger: {
          trigger: ".split-section",
          start: "top 80%",
        },
        x: -60,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
      });

      gsap.from(".split-right", {
        scrollTrigger: {
          trigger: ".split-section",
          start: "top 80%",
        },
        x: 60,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
      });

      // 3. Process Box: Scale up and reveal steps
      gsap.from(".process-box", {
        scrollTrigger: {
          trigger: ".process-box",
          start: "top 90%",
        },
        opacity: 0,
        scale: 0.95,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(".process-step", {
        scrollTrigger: {
          trigger: ".process-box",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
      });
    });
  }, []);

  return (
    <section id="bespoke" ref={containerRef} className="bg-[#2D2A26] text-[#FAF9F6] selection:bg-[#D4AF37] selection:text-white overflow-hidden">
      <div className="container mx-auto px-6 py-24">

        {/* ================= INTRO (Load Animation) ================= */}
        <div className="about-intro max-w-4xl mb-24">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Philosophy
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1.1] mb-8 font-serif italic">
            Crafting the Future of <br />
            <span className="text-[#D4AF37] not-italic">Bespoke Elegance</span>
          </h2>
          <p className="text-[#FAF9F6]/80 leading-relaxed text-xl font-light max-w-2xl border-l border-[#D4AF37]/30 pl-6">
            WeaveAR redefines tailoring by blending timeless craftsmanship
            with modern technology. Every garment is a masterpiece of precision.
          </p>
        </div>

        {/* ================= PILLARS (Scroll Animation) ================= */}
        <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4AF37]/20 border border-[#D4AF37]/20 mb-32">
          {[
            { title: "Made to Measure", desc: "Precision tailoring designed specifically for your proportions." },
            { title: "Virtual Try-On", desc: "Visualize the drape and fit of your custom pieces digitally." },
            { title: "Premium Fabrics", desc: "The finest wools and silks sourced from heritage mills." },
            { title: "Crafted with Care", desc: "Finished by hand with the obsessive detail of a master tailor." }
          ].map((item, index) => (
            <div key={index} className="pillar-card bg-[#2D2A26] p-10 hover:bg-[#36332F] transition-colors duration-500 group">
              <h3 className="text-xs tracking-[3px] uppercase text-[#D4AF37] mb-6 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.title}
              </h3>
              <p className="text-[#FAF9F6]/70 leading-relaxed text-sm group-hover:text-[#FAF9F6] transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CRAFT + TECH (Scroll Animation) ================= */}
        <div className="split-section grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div className="split-left group">
            <div className="relative overflow-hidden mb-8">
               <div className="h-px w-full bg-[#D4AF37]/30"></div>
               <div className="absolute top-0 left-0 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-700"></div>
            </div>
            <h3 className="text-3xl mb-6 font-serif tracking-wide text-[#FAF9F6]">Rooted in Tradition</h3>
            <p className="text-[#FAF9F6]/60 leading-relaxed mb-6 text-lg">
              Classical tailoring principles refined over generations. We believe the human touch is irreplaceable.
            </p>
          </div>

          <div className="split-right group">
            <div className="relative overflow-hidden mb-8">
               <div className="h-px w-full bg-[#D4AF37]/30"></div>
               <div className="absolute top-0 left-0 h-px w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-700"></div>
            </div>
            <h3 className="text-3xl mb-6 font-serif tracking-wide text-[#D4AF37]">Enhanced by Vision</h3>
            <p className="text-[#FAF9F6]/60 leading-relaxed mb-6 text-lg">
              Our AI-driven measurements ensure accuracy to the millimeter, preserving the soul of the craft.
            </p>
          </div>
        </div>

        {/* ================= PROCESS (Scroll Animation) ================= */}
        <div className="process-box bg-[#24211E] p-16 rounded-sm border border-[#D4AF37]/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[ "Select Fabric", "AI Measurement", "Digital Fitting", "Final Delivery" ].map((step, index) => (
              <div key={index} className="process-step flex flex-col border-l border-[#D4AF37]/20 pl-6 group">
                <span className="text-[#D4AF37] font-serif text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                <p className="text-[#FAF9F6] text-sm tracking-tighter uppercase font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}