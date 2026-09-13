import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Client01 from "../assets/testimonial-01.png"
import Client02 from "../assets/testimonial-02.png"
import Client03 from "../assets/testimonial-03.png"

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- 1. PAGE LOAD ANIMATIONS (Immediate) ---
      const tl = gsap.timeline();
      
      tl.from(".experience-header > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2 // Small delay to let the initial page render breathe
      });

      // --- 2. SCROLL ANIMATIONS (Triggered on Scroll) ---
      gsap.from(".experience-card", {
        scrollTrigger: {
          trigger: ".experience-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF9F6] text-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-6 py-32">

        {/* Added 'experience-header' class for GSAP targeting */}
        <div className="experience-header max-w-4xl mb-24">
          <p className="text-[10px] tracking-[6px] uppercase text-gray-500 mb-6 font-bold font-serif">
            The WeaveAR Experience
          </p>

          <h2 className="text-4xl lg:text-7xl leading-tight mb-8 font-serif">
            Trusted by Those Who
            <br />
            <span className="text-[#D4AF37] italic font-light text-3xl lg:text-6xl">Value Precision Fit</span>
          </h2>

          <p className="text-gray-600 leading-relaxed text-xl font-light border-l border-[#D4AF37]/30 pl-8 max-w-2xl">
            From first measurement to final stitch, our clients experience
            confidence and craftsmanship without compromise.
          </p>
        </div>

        <div className="experience-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The fit was unlike anything I’ve worn before. The virtual try-on gave me complete confidence.",
              name: "Arjun Mehta",
              role: "Entrepreneur, Mumbai",
              img: Client01
            },
            {
              quote: "Exceptional craftsmanship. Every detail felt intentional — from fabric to final delivery.",
              name: "Mahesh Rao",
              role: "Creative Director, London",
              img: Client02
            },
            {
              quote: "WeaveAR blends tradition with technology beautifully. This is the future of tailoring.",
              name: "Radhika Sharma",
              role: "Product Lead, Bengaluru",
              img: Client03
            },
          ].map((item, index) => (
            <div
              key={index}
              className="experience-card group relative h-137.5 flex flex-col justify-end overflow-hidden border border-gray-200 bg-white"
            >
              <img 
                src={item.img} 
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
              />

              <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent z-10" />

              <div className="relative z-20 p-10">
                <span className="text-[#D4AF37] text-4xl font-serif opacity-40 group-hover:opacity-100 transition-opacity duration-500 block mb-4">“</span>
                
                <p className="text-gray-700 leading-relaxed mb-8 text-sm italic group-hover:text-gray-900 transition-colors">
                  {item.quote}
                </p>

                <div className="h-px w-8 bg-[#D4AF37] mb-6 transform origin-left group-hover:w-full transition-all duration-700"></div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-widest text-gray-900">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#D4AF37] tracking-[2px] uppercase mt-1 font-bold">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}