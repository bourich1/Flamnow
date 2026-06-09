import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/auth/',
        '/_next/',
      ],
    },
    sitemap: 'https://flamnow.com/sitemap.xml',
  }
}
