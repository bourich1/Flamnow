import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface CaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data: projects } = await supabase.from("projects").select("id");
    return (projects || []).map((project) => ({
      id: project.id,
    }));
  } catch (err) {
    console.error("Error in generateStaticParams:", err);
    return [];
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: project },
    { data: allProjects }
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("projects").select("id, title").order("title", { ascending: true })
  ]);

  if (!project) {
    notFound();
  }

  // Find next project for suggestions
  const projectsList = allProjects || [];
  const currentIndex = projectsList.findIndex((p) => p.id === id);
  const nextProject = projectsList[(currentIndex + 1) % projectsList.length] || project;

  const brandColor = project.color || "#ED3F27";
  const resultsList = Array.isArray(project.results) ? project.results : [];
  const tagsList = Array.isArray(project.tags) ? project.tags : [];

  return (
    <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
      {/* Dynamic Background Theme Glow */}
      <div
        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Back Link */}
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white mb-10 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chronicles
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border self-start"
              style={{
                color: brandColor,
                borderColor: `${brandColor}30`,
                backgroundColor: `${brandColor}10`,
              }}
            >
              {project.category}
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
              {project.title}
            </h1>
            <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl italic">
              &ldquo;{project.tagline}&rdquo;
            </p>
          </div>

          {/* Sidebar specs */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm grid grid-cols-2 lg:grid-cols-1 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Client</p>
              <p className="text-base font-bold text-white">{project.client}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Year</p>
              <p className="text-base font-bold text-white">{project.year}</p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Scope & Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/10 pt-16 mb-20">
          {/* Main Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ED3F27]" /> The Challenge
              </h2>
              <p className="text-white/60 leading-relaxed text-base">
                {project.challenge}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> The Solution
              </h2>
              <p className="text-white/60 leading-relaxed text-base">
                {project.solution}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <p className="text-white/50 text-sm leading-relaxed">
                {project.long_description || project.longDescription}
              </p>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden backdrop-blur-sm h-fit">
            {/* Corner visual accent */}
            <div
              className="absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ backgroundColor: brandColor }}
            />
            <div className="flex items-center gap-2 text-[#ED3F27] mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Key Outcomes</span>
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
              Measurable Success
            </h3>

            <ul className="flex flex-col gap-6">
              {resultsList.map((result: string, idx: number) => (
                <li key={idx} className="flex gap-4 items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {result}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestion Section */}
        <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Next Case Study</span>
            <p className="text-2xl font-black text-white uppercase tracking-tight">{nextProject.title}</p>
          </div>

          <MagneticButton
            href={`/work/${nextProject.id}`}
            className="rounded-full bg-white text-black hover:bg-[#ED3F27] hover:text-white font-bold uppercase tracking-widest text-xs px-8 py-4 flex items-center gap-2 group transition-colors duration-300"
          >
            Explore Next
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
