import type { MetadataRoute } from 'next';

// In a real app, this would fetch from Supabase
async function getAllTenantSlugs() {
  return ['tenant-slug', 'default'];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> { 
  const slugs = await getAllTenantSlugs(); 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return slugs.map(slug => ({ 
    url: `${baseUrl}/clinic/${slug}`, 
    lastModified: new Date() 
  }));
}
