with open('src/app/sitemap.ts', 'w', encoding='utf-8') as f:
    f.write("""import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flamnow.com'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
  
  const projectUrls: MetadataRoute.Sitemap = []
  
  ;(projects || []).forEach(p => {
    projectUrls.push({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  const staticRoutes: MetadataRoute.Sitemap = []
  const paths = ['', '/about', '/services', '/projects', '/contact', '/work']
  
  paths.forEach(route => {
    staticRoutes.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route === '' ? 'daily' : 'monthly',
      priority: route === '' ? 1.0 : 0.8,
    })
  })

  return [...staticRoutes, ...projectUrls]
}
""")
