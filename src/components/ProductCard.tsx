import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Your imports
import Suits from "../assets/suit-01.jpg"
import Shirts from "../assets/shirt-01.jpg"
import WeddingWear from "../assets/wedding-wear-01.jpg"
import Formalwear from "../assets/formal-wear-01.jpg"
import CasualTailoring from "../assets/custome-tailoring-01.jpg"
import CustomeDesign from "../assets/custome-design-01.jpg"

gsap.registerPlugin(ScrollTrigger);

export default function Collections() {
  const sectionRef = useRef(null);

  // Data array with assigned images
  const collections = [
    {
      title: "The Bespoke Suit",
      desc: "Experience the pinnacle of tailoring with our signature hand-canvassed suits.",
      image: Suits,
      link: "/collections/shirts"
    },
    {
      title: "Artisanal Shirts",
      desc: "Hand-cut from the world's finest mills, designed for a perfect silhouette.",
      image: Shirts,
      link: "/collections/shirts"
    },
    {
      title: "Wedding Wear",
      desc: "Command presence on your special day with masterfully crafted ceremonial attire.",
      image: WeddingWear,
      link: "/collections/shirts"
    },
    {
      title: "Formalwear",
      desc: "Timeless elegance for the modern gentleman's evening wardrobe.",
      image: Formalwear,
      link: "/collections/shirts"
    },
    {
      title: "Casual Tailoring",
      desc: "Relaxed structures meeting premium fabrics for elevated everyday wear.",
      image: CasualTailoring,
      link: "/collections/shirts"
    },
    {
      title: "Custom Design",
      desc: "Your vision, our craftsmanship. Completely unique pieces made to order.",
      image: CustomeDesign,
      link: "/collections/shirts"
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".collection-card", {
        scrollTrigger: {
          trigger: ".collections-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="bg-[#2D2A26] text-[#FAF9F6] overflow-hidden"
    >
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl mb-24">
          <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6">
            The Collections
          </p>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">
            Curated Excellence <br />
            <span className="italic text-[#D4AF37]">For Every Occasion</span>
          </h2>
        </div>

        <div className="collections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {collections.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="collection-card group relative block aspect-4/5 overflow-hidden bg-[#1A1A1A]"
            >
              {/* ===== Background Image with Hover Effect ===== */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* ===== Content ===== */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                <span className="text-[#D4AF37] text-[10px] tracking-[4px] uppercase mb-4 block opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  New Season
                </span>
                
                <h3 className="text-3xl mb-4 font-serif tracking-wide leading-none">
                  {item.title}
                </h3>

                <p className="text-[#FAF9F6]/60 text-sm leading-relaxed mb-8 max-w-62.5 group-hover:text-[#FAF9F6] transition-colors duration-500">
                  {item.desc}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-xs tracking-[3px] uppercase text-[#D4AF37] relative overflow-hidden">
                    Explore
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-[#D4AF37] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500"></span>
                  </span>
                  <div className="w-0 h-px bg-[#D4AF37] group-hover:w-8 transition-all duration-500"></div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}