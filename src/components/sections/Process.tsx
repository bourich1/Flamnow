"use client";

import React, { useRef } from "react";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { useCursor } from "@/context/CursorContext";
import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface StepItem {
  num: string;
  title: string;
  tagline: string;
  desc: string;
}

interface ProcessProps {
  steps?: StepItem[];
}

export default function Process({ steps = [] }: ProcessProps) {
  const { setCursorType } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  const isLoading = !steps || steps.length === 0;

  const displaySteps = isLoading ? [
    { num: "01", title: "Loading Step", tagline: "Placeholder Tagline", desc: "Loading description for this step to form a skeleton." },
    { num: "02", title: "Loading Step", tagline: "Placeholder Tagline", desc: "Loading description for this step to form a skeleton." },
    { num: "03", title: "Loading Step", tagline: "Placeholder Tagline", desc: "Loading description for this step to form a skeleton." },
    { num: "04", title: "Loading Step", tagline: "Placeholder Tagline", desc: "Loading description for this step to form a skeleton." }
  ] : steps;

  useGSAP(() => {
    if (!containerRef.current || displaySteps.length === 0) return;

    // Register plugin to protect from tree-shaking
    gsap.registerPlugin(ScrollTrigger);

    // 1. Animate the vertical line height progress on scroll (scrubbed)
    gsap.fromTo(
      ".js-timeline-line",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          end: "bottom 70%",
          scrub: true,
          invalidateOnRefresh: true
        },
      }
    );

    // 2. Active dots animation as they hit viewport threshold
    const stepsElements = containerRef.current.querySelectorAll(".js-timeline-step");
    stepsElements.forEach((step) => {
      const dot = step.querySelector(".js-timeline-dot");
      if (!dot) return;

      gsap.fromTo(
        dot,
        { backgroundColor: "#171717", borderColor: "rgba(255, 255, 255, 0.2)" },
        {
          backgroundColor: "#ED3F27",
          borderColor: "#ED3F27",
          scrollTrigger: {
            trigger: step,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    // 3. Stagger reveal timeline steps on scroll
    gsap.fromTo(".js-timeline-step",
      { opacity: 0, x: 35 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

  }, { dependencies: [displaySteps], scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-bg-base py-space-6xl border-b border-white/5 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-4xl">
          
          {/* Left Column: Sticky Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex flex-col gap-space-sm">
            <SectionHeader
              tag="Methodology"
              title="Stoking the Flames."
              description="We divide our creative workflow into five hyper-focused cycles, carrying projects from initial market audit to massive scale."
            />
          </div>

          {/* Right Column: Timeline Steps */}
          <div className="lg:col-span-8 relative pl-8 sm:pl-12 flex flex-col gap-12 sm:gap-16">
            
            {/* GSAP Target: Background Progress Line */}
            <phantom-ui loading={isLoading ? true : undefined} animation="pulse" style={{ display: "contents" }}>
              <div className="absolute left-[5px] sm:left-4 top-4 bottom-4 w-[2px] bg-white-base/10 rounded-full overflow-hidden pointer-events-none">
                {/* This inner line will scale-y from 0 to 1 with GSAP scrolltrigger */}
                <div className="js-timeline-line w-full h-full bg-primary-base origin-top scale-y-0 transition-transform duration-500" />
              </div>

              {displaySteps.map((step) => (
              <div
                key={step.num}
                className="js-timeline-step group relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-start cursor-default"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                
                {/* GSAP Target: Timeline Indicator Dot */}
                <div
                  className="js-timeline-dot absolute -left-[33px] sm:-left-[38px] top-2.5 h-3.5 w-3.5 rounded-full bg-surface-base border border-white-base/20 transition-all duration-500 group-hover:bg-[#ED3F27] group-hover:border-[#ED3F27] group-hover:scale-125"
                  style={{
                    boxShadow: "0 0 10px rgba(0,0,0,0.8)",
                  }}
                />

                {/* Step Index Spec */}
                <div className="text-4xl sm:text-6xl font-black text-transparent stroke-text select-none leading-none shrink-0 font-display" style={{ WebkitTextStroke: "1px rgba(237,63,39,0.3)" }}>
                  {step.num}
                </div>

                {/* Step Descriptions Container */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary-base font-mono">
                      {step.tagline}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white-base group-hover:text-primary-base transition-colors duration-300 font-display">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white-base/60 text-sm leading-relaxed max-w-xl group-hover:text-white-base/80 transition-colors duration-300 font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
            </phantom-ui>
          </div>

        </div>
      </Container>
    </section>
  );
}
