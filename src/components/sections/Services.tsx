"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCursor } from "@/context/CursorContext";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { Check, ArrowUpRight } from "lucide-react";
import { getIconByName } from "@/lib/iconMap";
import Link from "next/link";

export type Feature = string;

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: Feature[];
  metric_label: string | null;
  metric_value: string | null;
  color: string;
  icon_name?: string;
}

export interface ServicesProps {
  services?: ServiceItem[];
}



export default function Services({ services = [] }: ServicesProps) {
  const { setCursorType } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  const isLoading = services.length === 0;

  const displayServices = isLoading ? [
    {
      id: "branding",
      title: "Loading Service",
      tagline: "Loading tagline",
      description: "Loading description that occupies a couple of lines for the skeleton.",
      features: ["Feature 1 placeholder", "Feature 2 placeholder", "Feature 3 placeholder"],
      metric_label: "Loading Metric",
      metric_value: "0.0x",
      color: "#ED3F27",
      icon_name: "Sparkles"
    },
    {
      id: "digital",
      title: "Loading Service",
      tagline: "Loading tagline",
      description: "Loading description that occupies a couple of lines for the skeleton.",
      features: ["Feature 1 placeholder", "Feature 2 placeholder", "Feature 3 placeholder"],
      metric_label: "Loading Metric",
      metric_value: "0.0x",
      color: "#ED3F27",
      icon_name: "Laptop"
    },
    {
      id: "campaigns",
      title: "Loading Service",
      tagline: "Loading tagline",
      description: "Loading description that occupies a couple of lines for the skeleton.",
      features: ["Feature 1 placeholder", "Feature 2 placeholder", "Feature 3 placeholder"],
      metric_label: "Loading Metric",
      metric_value: "0.0x",
      color: "#ED3F27",
      icon_name: "Target"
    }
  ] : services;

  // Determine repetition count based on list size for a smooth marquee loop
  const repeatCount: number = displayServices.length < 3 ? 8 : (displayServices.length < 6 ? 4 : 2);
  const repeatedServices: ServiceItem[] = Array(repeatCount).fill(displayServices).flat() as ServiceItem[];
  const translationPercentage: number = -(100 / repeatCount);
  const animationDuration: number = displayServices.length * 8; // 8s per item in a single set

  return (
    <section ref={containerRef} className="relative bg-[#111111] py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/3 right-0 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[#ED3F27]/5 blur-[150px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          tag="Capabilities"
          title="Stoke Your Market Cap."
          description="We operate at the intersection of creative strategy, high-speed engineering, and attributions, delivering outcome-oriented execution."
        />

        {/* Services Scroll Carousel Wrapper */}
        <phantom-ui loading={isLoading ? true : undefined} animation="pulse">
          <div className="relative w-full py-8 select-none group">
            {/* Visual fading overlays on left and right for premium aesthetics */}
            <div className="absolute top-0 left-0 w-8 sm:w-16 h-full bg-gradient-to-r from-[#111111] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 sm:w-16 h-full bg-gradient-to-l from-[#111111] to-transparent z-20 pointer-events-none" />

            <div
              className={`flex w-max gap-6 pr-6 ${!isLoading && "animate-services-marquee"}`}
              style={{
                "--marquee-translate": `${translationPercentage}%`,
                "--marquee-duration": `${animationDuration}s`,
              } as React.CSSProperties}
            >
              {repeatedServices.map((service: ServiceItem, index: number) => {
              const IconComponent = getIconByName(service.icon_name);
              return (
                <Link
                  key={`${service.id}-${index}`}
                  href="/services"
                  className="service-carousel-slide w-[320px] shrink-0 group/card relative bg-[#121212] border border-white/5 rounded-card p-space-lg flex flex-col justify-between min-h-[440px] overflow-hidden transition-all duration-500 hover:bg-[#1e1e1e] hover:-translate-y-2 hover:border-white/15 cursor-pointer"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  {/* Radial Glow Overlay driven by service accent color */}
                  <div
                    className="absolute inset-0 -z-10 bg-radial transition-all duration-700 opacity-0 group-hover/card:opacity-100 pointer-events-none"
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
                    <h3 className="text-2xl font-black text-white-base uppercase tracking-tight font-display group-hover/card:text-primary-base transition-colors duration-200">
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
                      {service.features.map((feature: Feature, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-xs text-white-base/70">
                          <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Link hover arrow action */}
                  <div className="absolute bottom-space-lg right-space-lg opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <div className="h-8 w-8 rounded-btn border border-white/10 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-white-base" />
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        </phantom-ui>
      </Container>
    </section>
  );
}
