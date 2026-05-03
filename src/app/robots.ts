import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/(dashboard)/', // Next.js route groups aren't in the URL but the nested paths are
        '/users',
        '/payments',
        '/subscriptions',
        '/receipt',
        '/status', // Assuming status is sensitive or just internal
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
