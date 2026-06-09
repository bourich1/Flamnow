"use client";

import React, { useRef } from "react";
import { useCursor } from "@/context/CursorContext";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { Sparkles, Target, Film, Laptop, Users, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  metric_label: string | null;
  metric_value: string | null;
  color: string;
}

interface ServicesProps {
  services?: ServiceItem[];
}

// Helper to map string to Lucide icon
const getIcon = (id: string) => {
  switch (id) {
    case "branding":
      return Sparkles;
    case "paid-ads":
      return Target;
    case "content-creation":
      return Film;
    case "website-design":
      return Laptop;
    case "social-media":
      return Users;
    default:
      return Sparkles;
  }
};

export default function Services({ services = [] }: ServicesProps) {
  const { setCursorType } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || services.length === 0) return;

    // Explicitly register in case of tree-shaking
    gsap.registerPlugin(ScrollTrigger);

    // Stagger reveal service cards as they enter the screen
    gsap.fromTo(".service-card", 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef, dependencies: [services] });

  if (services.length === 0) return null;

  return (
    <section ref={containerRef} className="relative bg-[#111111] py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/3 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#ED3F27]/5 blur-[150px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          tag="Capabilities"
          title="Stoke Your Market Cap."
          description="We operate at the intersection of creative strategy, high-speed engineering, and attributions, delivering outcome-oriented execution."
        />

        {/* Services Responsive Grid */}
        <div className="service-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {services.map((service) => {
            const IconComponent = getIcon(service.id);
            return (
              <div
                key={service.id}
                className="service-card group relative bg-[#121212] border border-white/5 rounded-card p-space-lg flex flex-col justify-between min-h-[440px] overflow-hidden transition-all duration-500 hover:bg-[#1e1e1e] hover:-translate-y-2 hover:border-white/15 cursor-pointer"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                {/* Radial Glow Overlay driven by service accent color */}
                <div
                  className="absolute inset-0 -z-10 bg-radial transition-all duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at top right, ${service.color}15 0%, transparent 60%)`,
                  }}
                />

                {/* Card Top: Icon and Metric */}
                <div className="flex justify-between items-start">
                  <div
                    className="h-12 w-12 rounded-input border flex items-center justify-center transition-colors duration-500"
                    style={{
                      color: service.color,
                      borderColor: `${service.color}20`,
                      backgroundColor: `${service.color}10`,
                    }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {(service.metric_value || service.metric_label) && (
                    <div className="text-right font-mono">
                      <p className="text-2xl font-black font-display leading-none" style={{ color: service.color }}>
                        {service.metric_value}
                      </p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white-base/40 mt-1">
                        {service.metric_label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Center: Core Info */}
                <div className="flex flex-col gap-space-xs mt-space-lg">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-base font-mono">
                    {service.tagline}
                  </span>
                  <h3 className="text-2xl font-black text-white-base uppercase tracking-tight font-display group-hover:text-primary-base transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-white-base/60 text-xs sm:text-sm leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>

                {/* Card Bottom: Features List */}
                <div className="mt-space-lg pt-space-md border-t border-white/5 flex flex-col gap-space-sm">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white-base/35 font-mono">Competencies</p>
                  <ul className="flex flex-col gap-2.5">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-white-base/70">
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link hover arrow action */}
                <div className="absolute bottom-space-lg right-space-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-8 w-8 rounded-btn border border-white/10 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-white-base" />
                  </div>
                </div>

                <Link href="/services" className="absolute inset-0 z-10" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
