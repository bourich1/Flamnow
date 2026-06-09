"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  metric: string;
  metric_label?: string;
  metricLabel?: string;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setCursorType } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 8500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials]);

  // Compute initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useGSAP(() => {
    if (!containerRef.current || testimonials.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".testimonials-content", 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef, dependencies: [testimonials] });

  if (testimonials.length === 0) return null;

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section ref={containerRef} className="relative bg-[#111111] py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#ED3F27]/5 blur-[120px] pointer-events-none" />

      <Container className="testimonials-content flex flex-col gap-space-4xl relative z-10 max-w-4xl">
        {/* Header */}
        <SectionHeader
          tag="Reviews"
          title="Attested Trust."
          align="center"
        />

        {/* Premium Testimonial Card Slider */}
        <div className="relative bg-[#121212] border border-white/5 rounded-card-lg p-8 md:p-12 backdrop-blur-sm overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl">
          
          {/* Card Accent Quote Icon */}
          <Quote className="h-10 w-10 text-[#ED3F27]/20 absolute top-8 left-8" />

          {/* Testimonial card transition */}
          <div className="relative flex-1 flex flex-col justify-center py-space-md mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex flex-col gap-8"
              >
                {/* Rating stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#ED3F27] text-[#ED3F27]" />
                  ))}
                </div>

                {/* Review Quote */}
                <p className="text-lg md:text-2xl font-medium text-white italic leading-relaxed font-body">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </p>

                {/* Card Bottom: User Avatar, Name & Company */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/5 pt-8 mt-4 w-full">
                   
                  {/* User Profile */}
                  <div className="flex items-center gap-4">
                    {/* Avatar Circle with initials gradient */}
                    <div className="h-12 w-12 rounded-btn bg-gradient-to-tr from-[#ED3F27] to-[#ED3F27]/40 text-white font-bold flex items-center justify-center text-sm font-display shadow-lg select-none">
                      {getInitials(activeTestimonial.name)}
                    </div>
                    <div>
                      <p className="text-base font-black text-white font-display tracking-tight leading-none">
                        {activeTestimonial.name}
                      </p>
                      <p className="text-[10px] text-[#ED3F27] uppercase tracking-widest font-bold mt-1.5 leading-none">
                        {activeTestimonial.role}, {activeTestimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Attributed Impact Score */}
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-3xl font-black text-white font-display leading-none">
                      {activeTestimonial.metric}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 mt-1.5 leading-none">
                      {activeTestimonial.metric_label || activeTestimonial.metricLabel}
                    </span>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-6">
            {/* Dots navigation */}
            <div className="flex gap-2.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-btn transition-all duration-300 ${
                    currentIndex === idx ? "w-8 bg-[#ED3F27]" : "w-2 bg-white/20"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Slider arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="h-10 w-10 rounded-btn border border-border flex items-center justify-center text-white/60 hover:border-[#ED3F27] hover:text-white transition-colors duration-300"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="h-10 w-10 rounded-btn border border-border flex items-center justify-center text-white/60 hover:border-[#ED3F27] hover:text-white transition-colors duration-300"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
