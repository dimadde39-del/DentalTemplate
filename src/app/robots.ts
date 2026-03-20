import type { MetadataRoute } from 'next';
import { getPlatformOrigin } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${getPlatformOrigin()}/sitemap.xml`,
  }
}
