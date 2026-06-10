"use client";

import React from "react";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { useCursor } from "@/context/CursorContext";
import { Flame, Rocket, BarChart3, HelpCircle } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Rocket,
  BarChart3
};

interface ValuePropItem {
  num: string;
  title: string;
  desc: string;
  iconName: string;
}

interface WhyFlamnowProps {
  valueProps?: ValuePropItem[];
}

const defaultProps = [
  {
    iconName: "Flame",
    num: "01",
    title: "Category Distorters",
    desc: "We reject typical template guidelines and boring copy. We design brand identities that assert visual authority, making your competition irrelevant."
  },
  {
    iconName: "Rocket",
    num: "02",
    title: "Speed Athletes",
    desc: "We ship assets at sprint speed. We build next-gen Next.js sites and cinematic videography in weeks, keeping you ahead of fast-moving markets."
  },
  {
    iconName: "BarChart3",
    num: "03",
    title: "Attributed Value",
    desc: "We back our aesthetics with numbers. We configure custom marketing tags to verify exactly how our work fuels your bottom-line expansion."
  }
];

export default function WhyFlamnow({ valueProps = [] }: WhyFlamnowProps) {
  const { setCursorType } = useCursor();
  const displayProps = valueProps && valueProps.length > 0 ? valueProps : defaultProps;

  return (
    <section className="relative bg-bg-base py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background visual orb */}
      <div className="absolute top-1/2 left-0 -z-10 h-96 w-96 rounded-full bg-primary-base/5 blur-[120px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl">
        <SectionHeader
          tag="Value Proposition"
          title="Why Flamnow."
          description="We do not build compromises. We operate at the intersection of creative direction and high-speed execution."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {displayProps.map((val, idx) => {
            const Icon = iconMap[val.iconName] || HelpCircle;
            
            // Define custom color combinations for each card's glow
            const colorsMap = [
              ["#ED3F27", "#FF9F0A"], // Category Distorters: Orange-red flame
              ["#BF5AF2", "#00E5FF"], // Speed Athletes: Cyber purple-cyan rocket
              ["#E2F13C", "#30D158"], // Attributed Value: Lime-green charts
            ];
            const cardColors = colorsMap[idx % colorsMap.length];

            // Define corresponding icon themes
            const iconThemes = [
              { color: "#ED3F27", bg: "rgba(237, 63, 39, 0.1)", border: "rgba(237, 63, 39, 0.15)", glow: "rgba(237, 63, 39, 0.25)" },
              { color: "#BF5AF2", bg: "rgba(191, 90, 242, 0.1)", border: "rgba(191, 90, 242, 0.15)", glow: "rgba(191, 90, 242, 0.25)" },
              { color: "#E2F13C", bg: "rgba(226, 241, 60, 0.1)", border: "rgba(226, 241, 60, 0.15)", glow: "rgba(226, 241, 60, 0.25)" },
            ];
            const theme = iconThemes[idx % iconThemes.length];

            return (
              <BorderGlow
                key={val.num}
                colors={cardColors}
                backgroundColor="rgba(23, 23, 23, 0.45)"
                borderRadius="24px"
                glowRadius="200px"
                glowIntensity={1.2}
                edgeSensitivity={85}
                coneSpread="65%"
                animated={true}
              >
                <div
                  className="group relative h-full w-full rounded-[calc(24px-1px)] p-space-lg flex flex-col justify-between min-h-[300px] transition-all duration-500 backdrop-blur-xl bg-white/[0.01] hover:bg-white/[0.04]"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  {/* Subtle inner highlight border for premium glass reflection */}
                  <div className="absolute inset-0 rounded-[calc(24px-1px)] border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-space-lg">
                      <div 
                        className="h-12 w-12 rounded-card flex items-center justify-center border transition-all duration-300"
                        style={{
                          color: theme.color,
                          backgroundColor: theme.bg,
                          borderColor: theme.border,
                          boxShadow: `0 0 15px ${theme.glow}`
                        }}
                      >
                        <span style={{ filter: `drop-shadow(0 0 8px ${theme.color}80)` }}><Icon className="h-6 w-6" /></span>
                      </div>
                      <span className="font-mono text-3xl font-black text-transparent stroke-text" style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)" }}>
                        {val.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white-base uppercase tracking-tight mb-space-xs group-hover:text-primary-base transition-colors duration-200 drop-shadow-md">
                      {val.title}
                    </h3>
                    <p className="text-white-base/60 text-sm leading-relaxed font-light">
                      {val.desc}
                    </p>
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
