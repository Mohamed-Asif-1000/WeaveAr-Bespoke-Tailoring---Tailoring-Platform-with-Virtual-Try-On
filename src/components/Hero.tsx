import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import HeroImage from "../assets/hero-image-01.jpg"

export default function Hero() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. STAGGERED TEXT ENTRANCE (Left Side)
      gsap.from(".hero-content", {
        x: -30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });

      // 2. BACKGROUND FRAME ENTRANCE
      gsap.from(bgRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.8,
        ease: "expo.out",
        delay: 0.4
      });

      // 3. THE CENTER-SPLIT BLUR REVEAL
      // We start with the image clipped to a thin center strip and heavily blurred
      gsap.fromTo(imageRef.current, 
        { 
          clipPath: "inset(0% 50% 0% 50%)", // Clipped to a vertical center line
          filter: "blur(20px)",            // Heavy blur at start
          scale: 1.2                       // Slight zoom
        }, 
        { 
          clipPath: "inset(0% 0% 0% 0%)",   // Opens to full width
          filter: "blur(0px)",             // Clears blur
          scale: 1,                        // Settles to normal size
          duration: 2.2,
          ease: "expo.inOut",
          delay: 0.6
        }
      );

      // 4. PERSISTENT FLOATING IDLE
      gsap.to(imageRef.current, {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-[#FAF9F6] overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT CONTENT */}
          <div className="z-20">
            <p className="hero-content text-xs tracking-[4px] uppercase text-gray-500 mb-4 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
              Crafted for You
            </p>

            <h1 className="hero-content text-4xl lg:text-6xl leading-tight text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bespoke Tailoring, <br />
              <span className="text-[#D4AF37]">Perfectly Measured</span>
            </h1>

            <p className="hero-content text-gray-600 max-w-xl mb-10 leading-relaxed text-lg font-light">
              Experience clothing that respects your silhouette. Precision-cut 
              fabrics meet modern technology for a fit that is uniquely yours.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to="/collections/shirts" className="px-8 py-3 bg-[#D4AF37] text-white text-sm tracking-widest uppercase hover:bg-[#B8962E] transition-colors duration-300">
              Explore Collection
              </Link>
              <Link to="/collections/shirts" className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] text-sm tracking-widest uppercase hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
              Virtual Try-On
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="relative group">
            
            {/* Background Accent Box */}
            <div 
              ref={bgRef}
              className="absolute -top-10 -left-10 w-full h-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 backdrop-blur-[1px] rounded-sm transition-transform duration-1000 group-hover:translate-x-4 group-hover:translate-y-4"
            >
              {/* Top-Left Corner on the Background Frame */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/40"></div>
            </div>
            
            {/* Image Wrapper with Reveal */}
            <div className="relative overflow-hidden shadow-2xl z-10">
              <img
                ref={imageRef}
                src={HeroImage}
                alt="Bespoke tailoring"
                className="w-full h-125 object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ willChange: "clip-path, filter" }}
              />
            </div>
            
            {/* Bottom-Right Corner Accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/60 pointer-events-none z-20"></div>
          </div>

        </div>
      </div>
    </section>
  );
}