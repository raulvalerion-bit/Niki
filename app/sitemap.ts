import type { MetadataRoute } from 'next';

const BASE = 'https://holaniki.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/onboarding`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/reembolsos`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/aviso-ia`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
