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
    supabase.from("faqs").select("*"),
    supabase.from("site_settings").select("value").eq("key", "pricing_packages").single()
  ]);

  const services = servicesData || [];
  const faqs = faqsData || [];
  const packages = pricingData?.value || undefined;

  return <ServicesClient services={services} faqs={faqs} packages={packages} />;
}
