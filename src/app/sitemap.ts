import { MetadataRoute } from 'next'

// We can bypass cookies / sessions during sitemap generation if running in static/dynamic hybrid mode
// By using a direct anonymous client or admin client
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flamnow.com'

  // Initialize a direct public client for sitemap querying (since we don't have request context for cookies here)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Fetch dynamic project slugs
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
  
  const projectUrls = (projects || []).map(p => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  // 2. Define static routes
  const staticRoutes = ['', '/about', '/services', '/projects', '/contact', '/work'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? ('daily' as const) : ('monthly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }))

  return [...staticRoutes, ...projectUrls]
}
