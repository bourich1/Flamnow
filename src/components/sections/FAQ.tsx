"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { useCursor } from "@/context/CursorContext";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface FAQItem {
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
}

interface FAQProps {
  faqs?: FAQItem[];
}

export default function FAQ({ faqs = [] }: FAQProps) {
  const { setCursorType } = useCursor();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  useGSAP(() => {
    if (!containerRef.current || faqs.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".faq-row", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef, dependencies: [faqs] });

  if (faqs.length === 0) return null;

  return (
    <section ref={containerRef} className="relative bg-[#111111] py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-[#ED3F27]/5 blur-[120px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl max-w-4xl">
        <SectionHeader
          tag="Inquiries"
          title="FAQ."
          align="center"
        />

        <div className="flex flex-col divide-y divide-border mt-space-md">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const qText = faq.question || faq.q || "";
            const aText = faq.answer || faq.a || "";
            return (
              <div key={idx} className="faq-row py-space-md">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left text-white hover:text-[#ED3F27] transition-colors duration-300"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  <span className="text-base sm:text-lg font-bold pr-space-md font-body">{qText}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-white/60 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#ED3F27]" : ""
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
                      <p className="text-white/60 text-sm leading-relaxed mt-space-sm pl-1 pr-space-lg">
                        {aText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
