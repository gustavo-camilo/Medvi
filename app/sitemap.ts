import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://medvi.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/obrigado',
    '/politica-de-privacidade',
    '/termos-de-uso',
    '/politica-de-reembolso',
    '/consentimento-medico',
    '/lgpd',
  ];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : 0.6,
  }));
}
