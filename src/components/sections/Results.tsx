"use client";

import React, { useEffect } from "react";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import { useCursor } from "@/context/CursorContext";
import { Eye, Users, FolderKanban, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

const iconMap = {
  Eye,
  Users,
  FolderKanban,
  DollarSign
};

interface ResultStatItem {
  id: string;
  label: string;
  displayVal: string;
  rawVal: string;
  prefix: string;
  suffix: string;
  iconName: "Eye" | "Users" | "FolderKanban" | "DollarSign";
  color: string;
  detail: string;
}

interface ResultsProps {
  data?: ResultStatItem[];
}

export default function Results({ data = [] }: ResultsProps) {
  const { setCursorType } = useCursor();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useCountUp(containerRef);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  const isLoading = data.length === 0;

  const displayData = isLoading ? [
    {
      id: "phantom-1",
      label: "Loading Metric",
      displayVal: "00.0",
      rawVal: "0",
      prefix: "",
      suffix: "M+",
      iconName: "Eye" as const,
      color: "#ED3F27",
      detail: "Loading detailed statistic explanation to fill space."
    },
    {
      id: "phantom-2",
      label: "Loading Metric",
      displayVal: "00.0",
      rawVal: "0",
      prefix: "",
      suffix: "M+",
      iconName: "Users" as const,
      color: "#ED3F27",
      detail: "Loading detailed statistic explanation to fill space."
    },
    {
      id: "phantom-3",
      label: "Loading Metric",
      displayVal: "00.0",
      rawVal: "0",
      prefix: "",
      suffix: "M+",
      iconName: "FolderKanban" as const,
      color: "#ED3F27",
      detail: "Loading detailed statistic explanation to fill space."
    },
    {
      id: "phantom-4",
      label: "Loading Metric",
      displayVal: "00.0",
      rawVal: "0",
      prefix: "",
      suffix: "M+",
      iconName: "DollarSign" as const,
      color: "#ED3F27",
      detail: "Loading detailed statistic explanation to fill space."
    }
  ] : data;

  return (
    <section ref={containerRef} className="relative bg-bg-base py-space-6xl border-b border-white/5 overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 right-0 -z-10 h-96 w-96 rounded-full bg-primary-base/5 blur-[120px] pointer-events-none" />

      <Container className="flex flex-col gap-space-4xl relative z-10">
        
        {/* Header */}
        <SectionHeader
          tag="Attributed Metrics"
          title="Stoking Scale."
          description="We operate with absolute numbers. Our marketing campaigns stoke customer loops and scale conversion outputs."
        />

        {/* Premium Stat Cards Grid */}
        <phantom-ui loading={isLoading ? true : undefined} animation="pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg py-4">
            {displayData.map((stat) => {
              const Icon = iconMap[stat.iconName] || Eye;
            return (
              <motion.div
                key={stat.id}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative bg-surface-base border border-white/5 rounded-card p-space-lg flex flex-col justify-between min-h-[240px] overflow-hidden transition-all duration-300 hover:bg-surface-sec hover:z-10 cursor-default"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                {/* Radial Glow Overlay */}
                <div
                  className="absolute inset-0 -z-10 bg-radial transition-all duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at top right, ${stat.color}15 0%, transparent 60%)`,
                  }}
                />

                {/* Card Top: Icon & Indicator */}
                <div className="flex justify-between items-center">
                  <div
                    className="h-10 w-10 rounded-input border flex items-center justify-center transition-colors duration-500"
                    style={{
                      color: stat.color,
                      borderColor: `${stat.color}20`,
                      backgroundColor: `${stat.color}10`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {/* Subtle color-matched light dot */}
                  <span
                    className="h-2 w-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: stat.color,
                      boxShadow: `0 0 10px ${stat.color}`,
                    }}
                  />
                </div>

                {/* Card Center: Large Count value prepared for GSAP targeting */}
                <div className="mt-space-lg flex flex-col">
                  {/* js-counter hook is assigned for future query targeting, with raw targets in dataset */}
                  <span
                    className="js-counter text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-black tracking-tight font-display leading-none"
                    style={{ color: stat.color }}
                    data-target-raw={stat.rawVal}
                    data-target-prefix={stat.prefix}
                    data-target-suffix={stat.suffix}
                  >
                    {stat.displayVal}
                  </span>
                  
                  <h3 className="text-sm font-bold text-white-base uppercase tracking-tight mt-space-xs">
                    {stat.label}
                  </h3>
                </div>

                {/* Card Bottom: Description brief */}
                <p className="text-white-base/40 text-xs leading-relaxed mt-space-sm border-t border-white/5 pt-space-xs">
                  {stat.detail}
                </p>
              </motion.div>
            );
          })}
          </div>
        </phantom-ui>
      </Container>
    </section>
  );
}
