import React from "react";
import { createClient } from "@/lib/supabase/server";
import ServicesClient from "./ServicesClient";


export const revalidate = 60; // Revalidate every minute

export default async function ServicesPage() {
  const supabase = await createClient();

  // Parallel data fetching
  const [
    { data: servicesData },
    { data: faqsData },
    { data: pricingData }
  ] = await Promise.all([
    supabase.from("services").select("*").order("title", { ascending: true }),
    supabase.from("faqs").select("*").order("question", { ascending: true }),
    supabase.from("site_settings").select("value").eq("key", "pricing_packages").single()
  ]);

  const rawServices = servicesData || [];
  const rawFaqs = faqsData || [];
  const packages = pricingData?.value || undefined;

  // Localize collections
  const services = rawServices.map(s => ({
    ...s,
    title: s.title,
    tagline: s.tagline,
    description: s.description,
    features: s.features,
    benefits: s.benefits,
  }));

  const faqs = rawFaqs.map(f => ({
    ...f,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <ServicesClient services={services} faqs={faqs} packages={packages}  />
  );
}
