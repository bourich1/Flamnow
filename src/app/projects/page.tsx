import React from "react";
import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60; // Revalidate every minute

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .order("title", { ascending: true });

  const projects = projectsData || [];

  return <ProjectsClient initialProjects={projects} />;
}
