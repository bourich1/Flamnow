import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles, Flame, Target } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data: projects } = await supabase.from("projects").select("id");
    return (projects || []).map((project) => ({
      slug: project.id,
    }));
  } catch (err) {
    console.error("Error in generateStaticParams:", err);
    return [];
  }
}

// Category-based dynamic gallery mapping so all database items render beautifully
const categoryGalleries: Record<string, { url: string; caption: string; aspect: string }[]> = {
  "Branding": [
    {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      caption: "VISUAL GUIDELINES ARCHITECTURE",
      aspect: "md:col-span-2 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=80",
      caption: "COLOR HARMONY INTEGRATION",
      aspect: "md:col-span-1 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      caption: "HIGH-FIDELITY BRANDING SYSTEM",
      aspect: "md:col-span-3 h-[500px]",
    },
  ],
  "Digital": [
    {
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      caption: "DASHBOARD USER INTERACTION",
      aspect: "md:col-span-2 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      caption: "FLUID LIQUID SVG SIMULATION",
      aspect: "md:col-span-1 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      caption: "BORDERLESS PAYMENT LEDGER",
      aspect: "md:col-span-3 h-[500px]",
    },
  ],
  "Campaigns": [
    {
      url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
      caption: "OMNICHANNEL LAUNCH CAMPAIGN",
      aspect: "md:col-span-2 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1502904582529-0a150b48a2d0?auto=format&fit=crop&w=800&q=80",
      caption: "AUDIENCE TARGETING DETAILS",
      aspect: "md:col-span-1 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=80",
      caption: "CONVERSION TRACKING FLOWS",
      aspect: "md:col-span-3 h-[500px]",
    },
  ],
  "Production": [
    {
      url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
      caption: "SPATIAL COMPUTING RENDER",
      aspect: "md:col-span-1 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=1200&q=80",
      caption: "HYPERREAL VISUAL ENGINE",
      aspect: "md:col-span-2 h-[400px]",
    },
    {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      caption: "NEON INTERFACE SYSTEMS",
      aspect: "md:col-span-3 h-[500px]",
    },
  ],
};

function parseResult(result: string) {
  const match = result.match(/^(\+?\d{1,3}(?:,\d{3})*(?:\.\d+)?\+?%?|\d+)\s*(.*)$/);
  if (match) {
    return { stat: match[1], text: match[2] };
  }
  
  if (result.toLowerCase().includes("3 major")) return { stat: "3", text: "Major EV partnerships acquired" };
  if (result.toLowerCase().includes("85%")) return { stat: "85%", text: "Higher brand recognition score" };
  if (result.toLowerCase().includes("4.5 million")) return { stat: "4.5M", text: "YouTube views within one week" };
  if (result.toLowerCase().includes("12,000,000+")) return { stat: "12M+", text: "Omnichannel impressions generated" };
  if (result.toLowerCase().includes("250,000+")) return { stat: "250K+", text: "Waitlist signups in 3 weeks" };

  return { stat: "★", text: result };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [
    { data: project },
    { data: allProjects }
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", slug).single(),
    supabase.from("projects").select("id, title").order("title", { ascending: true })
  ]);

  if (!project) {
    notFound();
  }

  const projectsList = allProjects || [];
  const currentIndex = projectsList.findIndex((p) => p.id === slug);
  const nextProject = projectsList[(currentIndex + 1) % projectsList.length] || project;
  
  const coverImg = project.cover_image || project.coverImage || "/placeholder.jpg";
  const brandColor = project.color || "#ED3F27";
  const resultsList = Array.isArray(project.results) ? project.results : [];
  const tagsList = Array.isArray(project.tags) ? project.tags : [];
  const gallery = categoryGalleries[project.category] || [];

  return (
    <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
      {/* Ambient Theme Background Glow */}
      <div
        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white mb-12 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO PORTFOLIO
        </Link>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span
              className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border self-start font-mono"
              style={{
                color: brandColor,
                borderColor: `${brandColor}30`,
                backgroundColor: `${brandColor}10`,
              }}
            >
              {project.category}
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none font-display">
              {project.title}
            </h1>
            <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl italic">
              &ldquo;{project.tagline}&rdquo;
            </p>
          </div>

          {/* Sidebar Specs Panel */}
          <div className="lg:col-span-4 w-full bg-white/5 border border-white/10 rounded-card p-6 md:p-8 backdrop-blur-sm grid grid-cols-2 lg:grid-cols-1 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Client</p>
              <p className="text-base font-bold text-white">{project.client}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Launch Year</p>
              <p className="text-base font-bold text-white">{project.year}</p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Scope & Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 px-3 py-1 rounded-full text-white/70 hover:border-white/20 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HERO IMAGE SHOWCASE */}
        <div className="relative h-[300px] sm:h-[500px] lg:h-[600px] w-full rounded-card overflow-hidden mb-24 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent z-10" />
          <Image
            src={coverImg}
            alt={`${project.client} Showcase mockup`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* NARRATIVE: CHALLENGE & SOLUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/10 pt-16 mb-24">
          <div className="lg:col-span-7 flex flex-col gap-12">
            {/* The Challenge */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-[#ED3F27]">
                <Target className="h-5 w-5" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-white font-display">
                  The Challenge
                </h2>
              </div>
              <p className="text-white/60 leading-relaxed text-base md:text-lg font-sans">
                {project.challenge}
              </p>
            </div>

            {/* The Solution */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-green-500">
                <Flame className="h-5 w-5" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-white font-display">
                  The Solution
                </h2>
              </div>
              <p className="text-white/60 leading-relaxed text-base md:text-lg font-sans">
                {project.solution}
              </p>
            </div>

            {/* Additional Project Detail */}
            <div className="border-l-2 border-white/10 pl-6 mt-4">
              <p className="text-white/40 text-sm leading-relaxed font-sans">
                {project.long_description || project.longDescription}
              </p>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-card p-8 md:p-10 relative overflow-hidden backdrop-blur-sm h-full">
              <div
                className="absolute top-0 right-0 h-40 w-40 rounded-full blur-[100px] opacity-10 pointer-events-none"
                style={{ backgroundColor: brandColor }}
              />
              
              <div className="flex items-center gap-2 text-[#ED3F27] mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Key Outcomes</span>
              </div>

              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8 font-display">
                MEASURABLE IMPACT.
              </h3>

              {/* Big Statistics Grid */}
              <div className="grid grid-cols-1 gap-6">
                {resultsList.map((result: string, idx: number) => {
                  const parsed = parseResult(result);
                  return (
                    <div
                      key={idx}
                      className="border-b border-white/5 pb-6 last:border-0 last:pb-0 flex flex-col gap-1.5"
                    >
                      <span
                        className="text-4xl sm:text-5xl font-black tracking-tight font-display"
                        style={{ color: brandColor }}
                      >
                        {parsed.stat}
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        {parsed.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        {gallery.length > 0 && (
          <div className="mb-24 border-t border-white/10 pt-16">
            <div className="flex flex-col gap-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ED3F27]">VISUAL GALLERY</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
                SYSTEM EXHIBITS.
              </h2>
            </div>

            {/* Bento-style Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-card overflow-hidden border border-white/10 ${item.aspect}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 z-10 transition-opacity duration-300 group-hover:opacity-90" />
                  
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Caption */}
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                      EXHIBIT {idx + 1}
                    </p>
                    <p className="text-sm font-bold uppercase text-white font-display">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION (NEXT CASE STUDY) */}
        <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">NEXT CHRONICLE</span>
            <p className="text-2xl font-black text-white uppercase tracking-tight font-display">{nextProject.title}</p>
          </div>

          <MagneticButton
            href={`/projects/${nextProject.id}`}
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
