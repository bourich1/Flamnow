"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Container from "@/components/layout/Container";
import MagneticButton from "@/components/ui/MagneticButton";
import { Sparkles, Target, Film, Laptop, Users, Check, ChevronDown, CheckCircle } from "lucide-react";

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

const defaultPackages = [
  {
    name: "Startup Spark",
    price: "$7,500",
    term: "per project",
    desc: "Establish a fearless visual identity and clean digital base to enter the market.",
    features: [
      "Brand Audit & Competitor Review",
      "Visual Identity Assets (Logo, Fonts, Colors)",
      "High-Performance Next.js Landing Page",
      "Paid Ad Campaign Scaffolding & Audiences",
      "Custom Attribution Setup"
    ],
    cta: "Ignite Startup",
    popular: false
  },
  {
    name: "Brand Flare",
    price: "$15,000",
    term: "per project",
    desc: "A comprehensive overhaul of your identity, marketing platform, and lead funnels.",
    features: [
      "Bespoke Brand Architecture & Guidelines",
      "Custom 5-page Interactive Next.js App",
      "High-Conversion Copywriting & Storyboards",
      "Cinematic Launch Trailer & Campaign Assets",
      "Attribution, Analytics & Retargeting Pipelines"
    ],
    cta: "Deploy Flare",
    popular: true
  },
  {
    name: "Enterprise Inferno",
    price: "Custom",
    term: "retainer model",
    desc: "Ongoing high-end creative, engineering, and performance scaling for market leaders.",
    features: [
      "Dedicated Creative Director & Core Crew",
      "Immersive Flagship Web Apps with WebGL",
      "High-volume Content & Motion Graphic Engine",
      "Omnichannel Campaign Management & Growth Loops",
      "Weekly Attribution Auditing & Market Intel"
    ],
    cta: "Contact Partners",
    popular: false
  }
];

interface ServicesClientProps {
  services: any[];
  faqs: any[];
  packages?: any[];
}

export default function ServicesClient({ services, faqs, packages = [] }: ServicesClientProps) {
  const { setCursorType } = useCursor();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const displayPackages = packages && packages.length > 0 ? packages : defaultPackages;

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-bg-base min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary-base/5 blur-[150px] pointer-events-none" />

      <Container className="relative z-10 flex flex-col gap-space-8xl">
        
        {/* Section 1: Detailed Capabilities Index */}
        <div className="flex flex-col gap-space-4xl">
          {/* Header */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-base">Capabilities</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white-base leading-tight font-display">
              ENGINEERING ATTENTION.
            </h1>
            <p className="text-white-base/60 text-lg leading-relaxed font-body">
              We reject standard marketing checklists. We build custom marketing systems that combine bold identity designs, fast code, and analytical campaign attribution.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {services.map((service) => {
              const IconComponent = getIcon(service.id);
              const mVal = service.metrics?.value || service.metric_value || "";
              const feats = Array.isArray(service.features) ? service.features : [];
              const benefitsList = Array.isArray(service.benefits) ? service.benefits : [];

              return (
                <div
                  key={service.id}
                  className="bg-surface-base border border-white-base/5 rounded-card p-space-lg flex flex-col justify-between min-h-[520px] transition-all duration-300 hover:border-white-base/10"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  <div className="flex flex-col gap-space-sm">
                    {/* Top row: Icon & Tagline */}
                    <div className="flex justify-between items-center">
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
                      <span className="text-xs font-bold font-display" style={{ color: service.color }}>
                        {mVal}
                      </span>
                    </div>

                    {/* Service Info */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-base font-body">{service.tagline}</span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white-base font-display mt-1">{service.title}</h3>
                      <p className="text-white-base/60 text-xs sm:text-sm leading-relaxed mt-2 font-body">{service.description}</p>
                    </div>
                  </div>

                  {/* Core Benefits */}
                  {benefitsList.length > 0 && (
                    <div className="mt-6 border-t border-white-base/5 pt-6 flex flex-col gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white-base/40 font-body">Key Benefits</p>
                      <ul className="flex flex-col gap-2.5">
                        {benefitsList.map((benefit: string, bIdx: number) => (
                          <li key={bIdx} className="text-xs text-white-base/85 flex items-start gap-2.5 font-body font-semibold">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competencies */}
                  {feats.length > 0 && (
                    <div className="mt-6 border-t border-white-base/5 pt-6 flex flex-col gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white-base/40 font-body">Scope Includes</p>
                      <ul className="flex flex-col gap-2">
                        {feats.map((feat: string, fIdx: number) => (
                          <li key={fIdx} className="text-xs text-white-base/70 flex items-center gap-2 font-body">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-base" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Pricing Packages */}
        <div className="flex flex-col gap-space-4xl">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-base">Partnerships</span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white-base font-display">
              SELECT YOUR FUEL RATE.
            </h2>
            <p className="text-white-base/50 max-w-md text-sm leading-relaxed font-body">
              From strategic setups to full monthly retainers, we structure outcome-driven pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-stretch">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-surface-base border rounded-card p-space-lg flex flex-col justify-between transition-all duration-300 hover:border-white-base/10 ${
                  pkg.popular ? "border-primary-base/50" : "border-white-base/5"
                }`}
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-base text-white-base text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-btn flex items-center gap-1.5 shadow-lg font-body">
                    <Sparkles className="h-3 w-3" /> Most Selected
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">{pkg.name}</h3>
                    <p className="text-white-base/60 text-xs mt-2 min-h-[40px] font-body">{pkg.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-2 font-display">
                    <span className="text-4xl sm:text-5xl font-black text-white-base">{pkg.price}</span>
                    <span className="text-xs text-white-base/40 font-bold uppercase tracking-widest">{pkg.term}</span>
                  </div>

                  <div className="h-[1px] w-full bg-white-base/10" />

                  <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white-base/40 font-body">Deliverables</p>
                    <ul className="flex flex-col gap-3 font-body">
                      {pkg.features && Array.isArray(pkg.features) && pkg.features.map((feat: string) => (
                        <li key={feat} className="flex gap-3 text-xs text-white-base/80">
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <MagneticButton
                    href="/contact"
                    className={`w-full rounded-btn font-bold uppercase tracking-widest text-xs py-4 transition-colors duration-300 ${
                      pkg.popular
                        ? "bg-primary-base hover:bg-white-base text-white-base hover:text-black"
                        : "bg-white-base hover:bg-primary-base text-black hover:text-white-base"
                    }`}
                  >
                    {pkg.cta}
                  </MagneticButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: FAQ Accordion */}
        {faqs.length > 0 && (
          <div className="max-w-3xl mx-auto border-t border-white-base/10 pt-20 w-full">
            <div className="flex flex-col items-center text-center gap-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-base">FAQ</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white-base font-display">
                RESOLVING INQUIRIES.
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-white-base/10">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-6">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center text-left text-white-base hover:text-primary-base transition-colors duration-300 font-body"
                      onMouseEnter={() => setCursorType("hover")}
                      onMouseLeave={() => setCursorType("default")}
                    >
                      <span className="text-base sm:text-lg font-bold pr-4">{faq.question || faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-white-base/50 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary-base" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                          className="overflow-hidden"
                        >
                          <p className="text-white-base/60 text-sm leading-relaxed mt-4 pl-1 pr-6 font-body">
                            {faq.answer || faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
