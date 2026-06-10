"use client";

import React, { useRef } from "react";
import { useCursor } from "@/context/CursorContext";
import MagneticButton from "../ui/MagneticButton";
import Container from "../layout/Container";
import { ArrowUpRight, Cpu, LineChart, Target, Zap } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

interface HeroProps {
  data?: {
    badge?: string;
    title_1?: string;
    title_stroke?: string;
    title_2?: string;
    description?: string;
    primary_btn_text?: string;
    primary_btn_url?: string;
    secondary_btn_text?: string;
    secondary_btn_url?: string;
    speed_card_title?: string;
    speed_card_value?: string;
    speed_card_sub?: string;
    roi_card_title?: string;
    roi_card_value?: string;
    ctr_card_title?: string;
    ctr_card_value?: string;
    ctr_card_sub?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const { setCursorType, setCursorText } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);

  const badge = data?.badge || "Fearless Creative Agency";
  const title1 = data?.title_1 || "We Ignite";
  const titleStroke = data?.title_stroke || "Untamed";
  const title2 = data?.title_2 || "Growth.";
  const description = data?.description || "We reject lukewarm marketing formulas. Flamnow designs bold brand systems, installs speed-optimized web flagships, and launches attribution campaigns for category leaders.";
  const primaryBtnText = data?.primary_btn_text || "Let's Stoke";
  const primaryBtnUrl = data?.primary_btn_url || "/contact";
  const secondaryBtnText = data?.secondary_btn_text || "Our Chronicles";
  const secondaryBtnUrl = data?.secondary_btn_url || "/projects";
  const speedCardTitle = data?.speed_card_title || "Flagship App";
  const speedCardValue = data?.speed_card_value || "Load Speed: 0.4s";
  const speedCardSub = data?.speed_card_sub || "VITALS 100%";
  const roiCardTitle = data?.roi_card_title || "Campaign ROI";
  const roiCardValue = data?.roi_card_value || "Attributed: 4.8x";
  const ctrCardTitle = data?.ctr_card_title || "Ads Performance";
  const ctrCardValue = data?.ctr_card_value || "CTR Rate: 6.2%";
  const ctrCardSub = data?.ctr_card_sub || "+22% ABOVE BM";

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Set initial states defensively
    gsap.set(".hero-badge", { opacity: 0, y: 15 });
    gsap.set(".hero-title-word", { opacity: 0, y: "110%" });
    gsap.set(".hero-desc", { opacity: 0, y: 20 });
    gsap.set(".hero-ctas", { opacity: 0, y: 20 });
    gsap.set(".hero-mascot-container", { opacity: 0, scale: 0.85 });
    
    gsap.set(".hero-float-1", { opacity: 0, x: -40 });
    gsap.set(".hero-float-2", { opacity: 0, x: 40 });
    gsap.set(".hero-float-3", { opacity: 0, y: 40 });
    gsap.set(".hero-progress-bar", { width: 0 });

    // 2. Main Entry Timeline
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.2 }
    });

    tl.to(".hero-badge", { opacity: 1, y: 0, duration: 0.8 })
      .to(".hero-title-word", {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out"
      }, "-=0.6")
      .to(".hero-desc", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
      .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
      .to(".hero-mascot-container", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.4)" }, "-=0.9")
      // Slide float cards into their default relative positions
      .to(".hero-float-1", { opacity: 1, x: 0, duration: 1.2 }, "-=0.9")
      .to(".hero-float-2", { opacity: 1, x: 0, duration: 1.2 }, "-=1.0")
      .to(".hero-float-3", { opacity: 1, y: 0, duration: 1.2 }, "-=1.0")
      // Animate progress bar inside the Analytics card
      .to(".hero-progress-bar", { width: "80%", duration: 1.6, ease: "power3.out" }, "-=0.6");

    // 3. Infinite Floating Cycles (GSAP loops — only on md+ screens, lightweight transforms)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.to(".hero-float-1", {
        y: -14,
        rotation: 1,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2
      });

      gsap.to(".hero-float-2", {
        y: 14,
        rotation: -1,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6
      });

      gsap.to(".hero-float-3", {
        y: -10,
        rotation: 1.5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-bg-base flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background Visual Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary-base/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full bg-white-base/5 blur-[120px] pointer-events-none" />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-4xl items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-6 flex flex-col gap-space-md items-start text-left relative z-30">
            
            {/* Tagline Badge */}
            <div className="hero-badge flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-base animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-base bg-primary-base/10 border border-primary-base/20 px-3 py-1.5 rounded-btn font-mono">
                {badge}
              </span>
            </div>

            {/* Main Headline (Mask-reveal split typography) */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white-base leading-[0.95] select-none font-display">
              <span className="block overflow-hidden py-1.5">
                {title1.split(" ").map((word, i) => (
                  <span key={i} className="hero-title-word inline-block mr-3">{word}</span>
                ))}
              </span>
              <span className="block overflow-hidden py-1.5 text-transparent stroke-text" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>
                <span className="hero-title-word inline-block">{titleStroke}</span>
              </span>
              <span className="block overflow-hidden py-1.5 text-primary-base">
                {title2.split(" ").map((word, i) => (
                  <span key={i} className="hero-title-word inline-block mr-3">{word}</span>
                ))}
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="hero-desc text-white-base/60 text-base sm:text-lg leading-relaxed max-w-lg font-body mt-2">
              {description}
            </p>

            {/* Interactive CTAs */}
            <div className="hero-ctas flex flex-wrap gap-4 items-center mt-4 w-full sm:w-auto">
              {primaryBtnText && (
                <MagneticButton
                  href={primaryBtnUrl}
                  className="w-full sm:w-auto rounded-btn bg-primary-base hover:bg-white-base text-white-base hover:text-black font-bold uppercase tracking-widest text-xs px-8 py-4.5 flex items-center justify-center gap-2 group transition-colors duration-300"
                >
                  {primaryBtnText}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </MagneticButton>
              )}

              {secondaryBtnText && (
                <MagneticButton
                  href={secondaryBtnUrl}
                  className="w-full sm:w-auto rounded-btn border border-white-base/15 hover:border-primary-base bg-transparent text-white-base font-bold uppercase tracking-widest text-xs px-8 py-4.5 flex items-center justify-center transition-colors duration-300"
                >
                  {secondaryBtnText}
                </MagneticButton>
              )}
            </div>
          </div>

          {/* Right Column: Honey Badger Mascot & Floating Marketing Cards */}
          <div
            className="lg:col-span-6 relative w-full min-h-[360px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[640px] mt-8 lg:mt-0 select-none isolate overflow-hidden"
            onMouseEnter={() => {
              setCursorType("text");
              setCursorText("FEARLESS");
            }}
            onMouseLeave={() => {
              setCursorType("default");
              setCursorText("");
            }}
          >
            
            {/* Spotlight glow effect */}
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="#ED3F27"
            />

            {/* Spline 3D Robot — fills the right column on desktop, sized on mobile */}
            <div className="hero-mascot-container relative md:absolute md:inset-0 w-full h-[360px] sm:h-[480px] md:h-full z-10">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                fallbackSrc="/flamnow-logo.png"
              />
            </div>

            {/* DESKTOP: Floating Cards (md+) — absolutely positioned over Spline */}
            <div className="hidden md:block">
              {/* 1. Website Speed Card */}
              {speedCardTitle && (
                <div className="hero-float-1 absolute top-4 left-4 z-20 bg-surface-base/80 border border-white-base/5 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-[200px]">
                  <div className="h-10 w-10 rounded-input bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0 font-mono">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{speedCardTitle}</p>
                    <p className="text-xs font-bold text-white-base truncate mt-0.5 font-mono">{speedCardValue}</p>
                    {speedCardSub && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
                        <span className="text-[8px] font-mono text-green-400">{speedCardSub}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Analytics Card */}
              {roiCardTitle && (
                <div className="hero-float-2 absolute top-16 right-4 z-20 bg-surface-base/80 border border-white-base/5 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-[210px]">
                  <div className="h-10 w-10 rounded-input bg-primary-base/10 border border-primary-base/20 flex items-center justify-center text-primary-base shrink-0">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden w-full">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{roiCardTitle}</p>
                    <p className="text-xs font-black text-white-base truncate mt-0.5 font-mono">{roiCardValue}</p>
                    <div className="w-full bg-white-base/10 h-1 rounded-full overflow-hidden mt-1.5">
                      <div className="hero-progress-bar bg-primary-base h-full rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Ads Target Card */}
              {ctrCardTitle && (
                <div className="hero-float-3 absolute bottom-4 right-16 z-20 bg-surface-base/80 border border-white-base/5 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-[190px]">
                  <div className="h-10 w-10 rounded-input bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{ctrCardTitle}</p>
                    <p className="text-xs font-bold text-white-base truncate mt-0.5 font-mono">{ctrCardValue}</p>
                    {ctrCardSub && (
                      <p className="text-[8px] font-mono text-cyan-400 mt-1 flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5 animate-bounce" /> {ctrCardSub}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE: Stacked Cards (below md) — flows below Spline scene, no overlap */}
            <div className="md:hidden flex flex-col gap-3 mt-4 px-1 relative z-20">
              {speedCardTitle && (
                <div className="bg-surface-base/90 border border-white-base/10 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-input bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{speedCardTitle}</p>
                    <p className="text-xs font-bold text-white-base truncate mt-0.5">{speedCardValue}</p>
                    {speedCardSub && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        <span className="text-[8px] text-green-400">{speedCardSub}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {roiCardTitle && (
                <div className="bg-surface-base/90 border border-white-base/10 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-input bg-primary-base/10 border border-primary-base/20 flex items-center justify-center text-primary-base shrink-0">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{roiCardTitle}</p>
                    <p className="text-xs font-black text-white-base truncate mt-0.5">{roiCardValue}</p>
                    <div className="w-full bg-white-base/10 h-1 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-primary-base h-full rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>
              )}

              {ctrCardTitle && (
                <div className="bg-surface-base/90 border border-white-base/10 backdrop-blur-md p-4 rounded-card shadow-lg flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-input bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white-base/40 uppercase tracking-widest truncate">{ctrCardTitle}</p>
                    <p className="text-xs font-bold text-white-base truncate mt-0.5">{ctrCardValue}</p>
                    {ctrCardSub && (
                      <p className="text-[8px] text-cyan-400 mt-1 flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" /> {ctrCardSub}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
