"use client";

import React from "react";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { useCursor } from "@/context/CursorContext";
import { Flame, Rocket, BarChart3, HelpCircle } from "lucide-react";

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
          {displayProps.map((val) => {
            const Icon = iconMap[val.iconName] || HelpCircle;
            return (
              <div
                key={val.num}
                className="group relative bg-surface-base border border-white/5 rounded-card p-space-lg flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-white/10 hover:bg-surface-sec"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <div>
                  <div className="flex justify-between items-center mb-space-lg">
                    <div className="h-12 w-12 rounded-card bg-primary-base/10 border border-primary-base/20 flex items-center justify-center text-primary-base">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-3xl font-black text-transparent stroke-text" style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)" }}>
                      {val.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white-base uppercase tracking-tight mb-space-xs group-hover:text-primary-base transition-colors duration-200">
                    {val.title}
                  </h3>
                  <p className="text-white-base/50 text-sm leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
