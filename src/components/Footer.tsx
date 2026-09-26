import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, X, Phone} from "lucide-react"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    return withMotion(footerRef.current, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      });

      tl.from(".footer-column", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      })
      .from(".footer-divider", {
        scaleX: 0,
        duration: 1.5,
        ease: "expo.inOut",
        transformOrigin: "left center",
      }, "-=0.5")
      .from(".footer-bottom", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.8");

    });
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="bg-[#1A1A1A] text-[#FAF9F6] border-t border-[#D4AF37]/20"
    >
      <div className="container mx-auto px-6 py-24">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="footer-column">
            {/* Hover effect on Logo: Subtle scale and glow */}
            <h2 
              className="text-5xl text-[#D4AF37]! mb-4 tracking-wider cursor-default hover:opacity-80 transition-opacity duration-500"
              style={{ fontFamily: "'Great Vibes', cursive"}}
            >
              WeaveAR
            </h2>
            <p className="text-[#FAF9F6]/60 text-sm leading-relaxed max-w-xs font-light">
              Bespoke tailoring reimagined through precision craftsmanship and
              immersive virtual technology.
            </p>
          </div>

          {/* Nav Columns with Animated Underline Effect */}
          {[
            {
              title: "Collections",
              links: [
                { name: "Shirts", path: "/collections/shirts" },
              ],
            },
            {
              title: "Experience",
              links: [
                { name: "Virtual Try-On", path: "/collections/shirts" },
              ],
            },
            {
              title: "Support",
              links: [
                { name: "Home", path: "/" },
              ],
            },
          ].map((col, i) => (
            <div key={i} className="footer-column">
              <h4 className="text-xs tracking-[3px] uppercase text-[#D4AF37] mb-6 font-bold">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      to={link.path} 
                      className="group relative text-sm text-[#FAF9F6]/70 hover:text-[#D4AF37] transition-colors duration-300 inline-block"
                    >
                      {link.name}
                      {/* The Animated Underline */}
                      <span className="absolute left-0 -bottom-1 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-divider h-px bg-[#D4AF37]/20 mb-12"></div>

        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="text-[#FAF9F6]/50 font-light italic">
            © {new Date().getFullYear()} WeaveAR. Crafted with precision.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="group text-[#FAF9F6]/60 hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1">
              <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="group text-[#FAF9F6]/60 hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1">
              <X size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="group text-[#FAF9F6]/60 hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1">
              <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="group text-[#FAF9F6]/60 hover:text-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1">
              <Phone size={18} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}