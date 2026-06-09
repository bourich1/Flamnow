"use client";

import React, { useState, useRef } from "react";
import { useCursor } from "@/context/CursorContext";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Container from "../layout/Container";
import SectionHeader from "../ui/SectionHeader";
import MagneticButton from "../ui/MagneticButton";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: "Branding" | "Digital" | "Campaigns" | "Production";
  year: string;
  description: string;
  color: string;
  cover_image?: string;
  coverImage?: string;
}

interface ProjectsProps {
  projects?: ProjectItem[];
}

const categories: ("All" | ProjectItem["category"])[] = [
  "All",
  "Branding",
  "Digital",
  "Campaigns",
  "Production",
];

export default function Projects({ projects = [] }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectItem["category"]>("All");
  const { setCursorType, setCursorText } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // 1. Initial ScrollTrigger Scroll-reveal
  useGSAP(() => {
    if (!containerRef.current || projects.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".project-card-item", 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef, dependencies: [projects] });

  // 2. Stagger filter animation when active tab changes
  useGSAP(() => {
    if (projects.length === 0) return;
    gsap.fromTo(
      ".project-card-item",
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }
    );
  }, { dependencies: [activeCategory], scope: containerRef });

  if (projects.length === 0) return null;

  return (
    <section ref={containerRef} className="relative bg-bg-base py-space-6xl border-b border-white/5 overflow-hidden">
      <Container className="flex flex-col gap-space-4xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-space-md">
          <SectionHeader
            tag="Selected Case Studies"
            title="Featured Works."
          />

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-space-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-btn ${
                  activeCategory === cat ? "text-primary-base" : "text-white-base/60 hover:text-white-base"
                }`}
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute inset-0 -z-10 rounded-btn bg-white/5 border border-white/10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="project-grid-container grid grid-cols-1 lg:grid-cols-2 gap-space-lg lg:gap-space-xl">
          {filteredProjects.map((project) => {
            const coverImg = project.cover_image || project.coverImage || "/volt_cover.png";
            return (
              <div
                key={project.id}
                className="project-card-item group relative flex flex-col bg-surface-base border border-white/5 rounded-card overflow-hidden transition-all duration-500 hover:border-white/15 hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => {
                  setCursorType("text");
                  setCursorText("VIEW");
                }}
                onMouseLeave={() => {
                  setCursorType("default");
                  setCursorText("");
                }}
              >
                {/* 1. Cover Image container */}
                <div className="relative h-[240px] sm:h-[320px] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-base to-transparent z-10" />
                  <Image
                    src={coverImg}
                    alt={`${project.client} Case Study`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={project.id === "volt-audio" || project.id === "vortex-pay"}
                  />
                </div>

                {/* 2. Content section */}
                <div className="p-space-lg flex flex-col gap-space-sm relative z-20">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-btn border font-mono"
                      style={{
                        color: project.color,
                        borderColor: `${project.color}30`,
                        backgroundColor: `${project.color}10`,
                      }}
                    >
                      {project.category}
                    </span>
                    <span className="text-xs text-white-base/40 font-mono font-bold uppercase">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white-base uppercase tracking-tight font-display group-hover:text-primary-base transition-colors duration-200 mt-2">
                    {project.title}
                  </h3>

                  <p className="text-white-base/60 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                    {project.description}
                  </p>

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-space-md mt-space-xs">
                    <span className="text-xs font-bold uppercase tracking-widest text-white-base group-hover:text-primary-base transition-colors duration-300">
                      Explore Case Study
                    </span>
                    <div className="h-10 w-10 rounded-btn border border-white/10 group-hover:border-primary-base flex items-center justify-center transition-all duration-300 bg-white/5">
                      <ArrowUpRight className="h-5 w-5 text-white-base group-hover:text-primary-base transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Action Link overlay */}
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-30" />
              </div>
            );
          })}
        </div>

        {/* Explore Showcase Footer Button */}
        <div className="text-center mt-space-md">
          <MagneticButton
            href="/projects"
            className="rounded-btn bg-white-base px-10 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-primary-base hover:text-white-base transition-colors duration-300"
          >
            Explore Full Showcase
          </MagneticButton>
        </div>

      </Container>
    </section>
  );
}
