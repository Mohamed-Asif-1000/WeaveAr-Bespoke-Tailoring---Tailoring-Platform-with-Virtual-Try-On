import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the steps
      gsap.from(".how-step", {
        scrollTrigger: {
          trigger: ".how-grid",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animate the border lines "growing"
      gsap.from(".step-border", {
        scrollTrigger: {
          trigger: ".how-grid",
          start: "top 85%",
        },
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] text-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-6 py-28">

        {/* Section Header */}
        <div className="max-w-3xl mb-24">
          <p
            className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-6 font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </p>

          <h2
            className="text-4xl lg:text-5xl leading-tight mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Tailoring, Designed for
            <span className="text-[#D4AF37] italic"> You</span>
          </h2>

          <p className="text-gray-600 leading-relaxed text-lg font-light border-l-2 border-[#D4AF37]/20 pl-6">
            From selection to delivery, our process blends technology and
            craftsmanship to create garments that fit perfectly and feel
            effortless.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="how-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              step: "01",
              title: "Choose Style",
              desc: "Browse curated designs, fabrics, and finishes tailored to your taste."
            },
            {
              step: "02",
              title: "Virtual Try-On",
              desc: "Experience how the garment fits your body using AR-powered visualization."
            },
            {
              step: "03",
              title: "Perfect the Fit",
              desc: "Fine-tune measurements and preferences before the garment is crafted."
            },
            {
              step: "04",
              title: "Crafted & Delivered",
              desc: "Hand-finished by expert tailors and delivered directly to your door."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="how-step relative pl-8 group"
            >
              {/* Animated Vertical Border */}
              <div className="step-border absolute left-0 top-0 w-px h-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] transition-colors duration-500"></div>
              
              {/* Step Number - Positioned accurately */}
              <span
                className="block text-[#D4AF37] text-sm font-bold tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.step}
              </span>

              <h3
                className="text-xl mb-4 tracking-tight font-serif"
              >
                {item.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-900 transition-colors duration-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}