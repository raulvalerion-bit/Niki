import type { MetadataRoute } from 'next';

// SEO técnico (45): se indexa lo público; la app por dentro, el panel y la API no.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app', '/admin', '/api', '/paywall', '/login'] },
    sitemap: 'https://holaniki.com/sitemap.xml',
  };
}
