"use client";

import React, { useRef } from "react";
import MagneticButton from "../ui/MagneticButton";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface CTAProps {
  data?: {
    title?: string;
    subtitle?: string;
    description?: string;
    button_text?: string;
    button_url?: string;
    label?: string;
  };
}

export default function CTA({ data }: CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const label = data?.label || "Launch Project";
  const title = data?.title || "READY TO STOKE";
  const subtitle = data?.subtitle || "THE FLAMES?";
  const description = data?.description || "Let's design a brand system, build a conversion flagship, or launch campaigns that disrupt your category. No commitments, just pure creative strategy.";
  const buttonText = data?.button_text || "Stoke the Fire";
  const buttonUrl = data?.button_url || "/contact";

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Timeline reveal for the CTA contents
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(".cta-label", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(".cta-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".cta-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .fromTo(".cta-btn", { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.3)" }, "-=0.5");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[#111111] py-24 md:py-36 px-6 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-[#ED3F27]/10 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center gap-8 md:gap-10">
        <span className="cta-label text-xs font-bold uppercase tracking-widest text-[#ED3F27] font-mono">{label}</span>
        
        <h2 className="cta-title text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none font-display">
          {title} <br />
          <span className="text-transparent stroke-text" style={{ WebkitTextStroke: "1px var(--border)" }}>
            {subtitle}
          </span>
        </h2>
        
        <p className="cta-desc text-white/60 text-base md:text-lg max-w-lg leading-relaxed font-sans">
          {description}
        </p>

        <div className="cta-btn mt-4">
          <MagneticButton
            href={buttonUrl}
            className="rounded-full bg-[#ED3F27] hover:bg-white text-white hover:text-[#111111] font-bold uppercase tracking-widest text-xs px-12 py-5 flex items-center gap-3 group transition-colors duration-300"
          >
            {buttonText}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
