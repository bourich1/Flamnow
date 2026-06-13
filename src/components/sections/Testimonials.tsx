"use client";

import React, { useEffect } from "react";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import SubmitReview from "./SubmitReview";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  metric: string;
  metric_label?: string;
  metricLabel?: string;
  image_url?: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  const isLoading = testimonials.length === 0;

  const displayTestimonials = isLoading ? [
    {
      id: "phantom-1",
      name: "Placeholder Name",
      role: "Placeholder Role",
      company: "Company",
      quote: "Loading testimonial quote that takes up sufficient lines in this card to act as a placeholder. This will be replaced by actual data.",
      metric: "10x",
      metric_label: "ROI",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    },
    {
      id: "phantom-2",
      name: "Placeholder Name",
      role: "Placeholder Role",
      company: "Company",
      quote: "Loading testimonial quote that takes up sufficient lines in this card to act as a placeholder. This will be replaced by actual data.",
      metric: "10x",
      metric_label: "ROI",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    },
    {
      id: "phantom-3",
      name: "Placeholder Name",
      role: "Placeholder Role",
      company: "Company",
      quote: "Loading testimonial quote that takes up sufficient lines in this card to act as a placeholder. This will be replaced by actual data.",
      metric: "10x",
      metric_label: "ROI",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      rating: 5
    }
  ] : testimonials;

  // Map database testimonials to match Column schema (injecting beautiful Unsplash fallback portraits since DB schema doesn't store avatar URIs)
  const dbMappedTestimonials = displayTestimonials.map((t, index) => {
    const fallbackPortraits = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80"
    ];
    return {
      text: t.quote,
      name: t.name,
      role: `${t.role}${t.company ? `, ${t.company}` : ''} ${t.metric ? `(${t.metric} ${t.metric_label || t.metricLabel || ''})` : ''}`,
      image: t.image_url || fallbackPortraits[index % fallbackPortraits.length],
      rating: t.rating || 5
    };
  });

  // Dynamically repeat database elements to guarantee at least 15 items for smooth scrolling
  const minItemsNeeded = 15;
  const repeatCount = Math.ceil(minItemsNeeded / dbMappedTestimonials.length);
  const repeatedList = Array(repeatCount).fill(dbMappedTestimonials).flat();

  // Distribute testimonials evenly across 3 marquee columns
  const count = repeatedList.length;
  const colSize = Math.ceil(count / 3);
  const firstColumn = repeatedList.slice(0, colSize);
  const secondColumn = repeatedList.slice(colSize, colSize * 2);
  const thirdColumn = repeatedList.slice(colSize * 2);

  return (
    <section className="relative bg-[#111111] py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#ED3F27]/5 blur-[120px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl relative z-10 w-full">
        {/* Header */}
        <SectionHeader
          tag="Reviews"
          title="Attested Trust."
          align="center"
        />

        {/* Scrolling Columns Testimonials Marquee with CSS Gradient Masking */}
        <phantom-ui loading={isLoading ? true : undefined} animation="pulse">
          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden w-full select-none">
            <TestimonialsColumn testimonials={firstColumn} duration={25} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
          </div>
        </phantom-ui>

        {/* Feedback Button & Modal */}
        <SubmitReview />
      </Container>
    </section>
  );
}
