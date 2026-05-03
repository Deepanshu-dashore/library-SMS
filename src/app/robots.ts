import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.sawariyalibrary.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/registration', '/privacy', '/terms'],
        disallow: [
          '/api/',
          '/login',
          '/dashboard',
          '/dashboard/',
          '/status/',
          '/receipt/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
