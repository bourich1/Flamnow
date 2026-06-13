"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import { createClient } from "@/lib/supabase/client";


import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowUpRight, Compass, HeartHandshake, Zap, Target, HelpCircle } from "lucide-react";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialty: string;
  instagram: string;
  linkedin: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Compass,
  Zap,
  HeartHandshake
};

const defaultValues = [
  {
    iconName: "Compass",
    title: "Bold Convictions",
    desc: "We reject lukewarm compromise. We research target psychology to frame original, opinionated identities that capture long-term market authority."
  },
  {
    iconName: "Zap",
    title: "High-Fidelity Speed",
    desc: "We work in fast sprints. We build Next.js interfaces and produce cinematic campaign media in weeks, not months."
  },
  {
    iconName: "HeartHandshake",
    title: "Numeric Honesty",
    desc: "Aesthetics must perform. We install server-side tag attribution pipelines to prove exactly how our creations fuel your conversions."
  }
];

export default function AboutPage() {
  const { setCursorType } = useCursor();
  
  const supabase = createClient();
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [values, setValues] = useState<any[]>(defaultValues);
  const [pageContent, setPageContent] = useState<any>({
    narrativeTitle: "Fueling Category Leaders.",
    narrativeDesc1: "Flamnow was founded on a singular conviction: design is a product's primary business leverage. We fuse artistic direction with performant code to stoke brands that outscale the generic.",
    narrativeSubtitle: "We only build things that burn indelibly.",
    narrativeDesc2: "The digital arena is crowded, noisy, and template-driven. Algorithms promote visual monotony, and platforms encourage brands to blend in. We built Flamnow to challenge this aesthetic decay. We do not do template layouts, stock layouts, or lukewarm ad copy.",
    narrativeDesc3: "We operate as a tight team of multidisciplinary creators: strategic researchers, high-fidelity developers, and CGI artists. By keeping our team integrated, we bypass corporate bloat and ship state-of-the-art products at speed.",
    missionTitle: "To dismantle the generic, stoke visual authority, and make compromises obsolete.",
    narrativeTag: "Our Narrative",
    missionTag: "Our Mission",
    philosophyTag: "Core Philosophy",
    philosophyTitle: "What Stokes Us.",
    philosophyDesc: "Our decisions are guided by three values that ensure creativity maps to financial performance.",
    teamTag: "The Crew",
    teamTitle: "Creative Athletes.",
    teamDesc: "Meet the core minds stoking Flamnow's designs, codes, and attribution frameworks."
  });

  useEffect(() => {
    async function fetchData() {
      const [teamRes, settingsRes] = await Promise.all([
        supabase.from("team_members").select("*").order("name", { ascending: true }),
        supabase.from("site_settings").select("*").in("key", ["about_values", "about_page_content"])
      ]);
      
      if (!teamRes.error && teamRes.data) {
        setTeam(teamRes.data);
      }
      if (!settingsRes.error && settingsRes.data) {
        const configList = settingsRes.data;
        configList.forEach((item: any) => {
          if (item.key === "about_values") {
            setValues(item.value || defaultValues);
          } else if (item.key === "about_page_content") {
            setPageContent(item.value);
          }
        });
      }
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="bg-bg-base min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary-base/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full bg-primary-base/5 blur-[130px] pointer-events-none" />

      <Container className="relative z-10 flex flex-col gap-space-8xl">
        
        {/* Section 1: Story (Header & Narrative) */}
        <div className="flex flex-col gap-space-4xl">
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-base">{pageContent.narrativeTag || "Our Narrative"}</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white-base leading-tight font-display">
              {pageContent.narrativeTitle}
            </h1>
            <p className="text-white-base/60 text-lg leading-relaxed font-body whitespace-pre-wrap">
              {pageContent.narrativeDesc1}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white-base/10 pt-space-lg">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white-base leading-tight font-display">
                {pageContent.narrativeSubtitle}
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6 text-white-base/60 leading-relaxed text-sm sm:text-base font-body">
              <p className="whitespace-pre-wrap">
                {pageContent.narrativeDesc2}
              </p>
              <p className="whitespace-pre-wrap">
                {pageContent.narrativeDesc3}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Mission (Typographic Banner) */}
        <div className="relative bg-surface-base border border-white-base/5 rounded-card-lg p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary-base/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2 text-primary-base">
              <Target className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">{pageContent.missionTag || "Our Mission"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white-base uppercase tracking-tight font-display leading-tight whitespace-pre-wrap">
              {pageContent.missionTitle}
            </h2>
          </div>

          <div className="shrink-0">
            <MagneticButton
              href="/contact"
              className="rounded-btn bg-white-base hover:bg-primary-base text-black hover:text-white-base font-bold uppercase tracking-widest text-xs px-8 py-4 transition-colors duration-300"
            >
              Collaborate
            </MagneticButton>
          </div>
        </div>

        {/* Section 3: Values */}
        <div className="flex flex-col gap-space-4xl">
          <SectionHeader
            tag={pageContent.philosophyTag || "Core Philosophy"}
            title={pageContent.philosophyTitle || "What Stokes Us."}
            description={pageContent.philosophyDesc || "Our decisions are guided by three values that ensure creativity maps to financial performance."}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {values.map((val) => {
              const Icon = iconMap[val.iconName] || HelpCircle;
              return (
                <div
                  key={val.title}
                  className="bg-surface-base border border-white-base/5 rounded-card p-space-lg flex flex-col justify-between min-h-[280px]"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  <div className="h-12 w-12 rounded-input bg-primary-base/10 border border-primary-base/20 flex items-center justify-center text-primary-base mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white-base uppercase tracking-tight mb-2 font-display">{val.title}</h3>
                    <p className="text-white-base/50 text-sm leading-relaxed font-body">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Team */}
        {team.length > 0 && (
          <div className="flex flex-col gap-space-4xl">
            <SectionHeader
              tag={pageContent.teamTag || "The Crew"}
              title={pageContent.teamTitle || "Creative Athletes."}
              description={pageContent.teamDesc || "Meet the core minds stoking Flamnow's designs, codes, and attribution frameworks."}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between min-h-[380px] bg-surface-base border border-white-base/5 rounded-card p-space-lg transition-all duration-300 hover:border-white-base/10"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary-base bg-primary-base/10 border border-primary-base/20 px-3 py-1 rounded-btn">
                      {member.specialty}
                    </span>
                    <h3 className="text-xl font-black text-white-base uppercase tracking-tight mt-6 group-hover:text-primary-base transition-colors duration-200 font-display">
                      {member.name}
                    </h3>
                    <p className="text-xs text-white-base/40 font-bold uppercase tracking-widest mt-1 font-body">
                      {member.role}
                    </p>
                    <p className="text-white-base/60 text-xs mt-6 leading-relaxed font-body">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white-base/5">
                    <div className="flex gap-4 font-body text-xs">
                      {member.linkedin && member.linkedin !== '#' && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white-base/50 hover:text-white-base transition-colors duration-200">
                          LinkedIn
                        </a>
                      )}
                      {member.instagram && member.instagram !== '#' && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-white-base/50 hover:text-white-base transition-colors duration-200">
                          Instagram
                        </a>
                      )}
                    </div>
                    <div className="h-7 w-7 rounded-btn border border-white-base/10 flex items-center justify-center text-white-base/50 group-hover:border-primary-base group-hover:text-primary-base transition-all duration-300 bg-white/5">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
