import Hero from "@/components/sections/Hero";
import TrustedClients from "@/components/sections/TrustedClients";
import Services from "@/components/sections/Services";
import WhyFlamnow from "@/components/sections/WhyFlamnow";
import Results from "@/components/sections/Results";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import { Agentation } from "agentation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Parallel data fetching for performance
  const [
    { data: heroSettings },
    { data: clientsData },
    { data: servicesData },
    { data: resultsSettings },
    { data: projectsData },
    { data: testimonialsData },
    { data: faqsData },
    { data: ctaSettings },
    { data: whySettings },
    { data: processSettings }
  ] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "hero_content").single(),
    supabase.from("clients").select("name").order("name", { ascending: true }),
    supabase.from("services").select("*").order("title", { ascending: true }),
    supabase.from("site_settings").select("value").eq("key", "results_stats").single(),
    supabase.from("projects").select("*").order("title", { ascending: true }),
    supabase.from("testimonials").select("*"),
    supabase.from("faqs").select("*"),
    supabase.from("site_settings").select("value").eq("key", "contact_cta").single(),
    supabase.from("site_settings").select("value").eq("key", "why_flamnow_value_props").single(),
    supabase.from("site_settings").select("value").eq("key", "process_steps").single()
  ]);

  const clientNames = clientsData ? clientsData.map((c) => c.name) : [];
  const heroData = heroSettings?.value || undefined;
  const servicesList = (servicesData || []) as any[];
  const resultsData = resultsSettings?.value || [];
  const projectsList = (projectsData || []) as any[];
  const testimonialsList = (testimonialsData || []) as any[];
  const faqsList = (faqsData || []) as any[];
  const ctaData = ctaSettings?.value || undefined;
  const whyData = whySettings?.value || undefined;
  const processData = processSettings?.value || undefined;

  return (
    <div className="relative w-full flex flex-col bg-bg-base">
      {/* 1. Hero Section */}
      <Hero data={heroData} />

      {/* 2. Trusted Clients Logos */}
      <TrustedClients clients={clientNames} />

      {/* 3. Core Services */}
      <Services services={servicesList} />

      {/* 4. Why Flamnow Value Props */}
      <WhyFlamnow valueProps={whyData} />

      {/* 5. Key Results Metrics */}
      <Results data={resultsData} />

      {/* 6. Selected Projects Portfolio */}
      <Projects projects={projectsList} />

      {/* 7. Creative Process Timelines */}
      <Process steps={processData} />

      {/* 8. Testimonials Reviews */}
      <Testimonials testimonials={testimonialsList} />

      {/* 9. FAQs Accordions */}
      <FAQ faqs={faqsList} />

      {/* 10. Contact CTA Gate */}
      <CTA data={ctaData} />

      <Agentation />
    </div>
  );
}
