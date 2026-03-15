import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { siteConfig as fallbackConfig, SiteConfig } from '@/config/site';

export async function getSiteConfig(slug: string): Promise<SiteConfig> {
  return unstable_cache(
    async (slug: string) => {
      const { data } = await supabase.from('clinics').select('*').eq('slug', slug).single();
      
      // Fallback to default static config if db query fails or clinic not found
      if (!data) return fallbackConfig;
      
      return {
        clinicName: data.name || fallbackConfig.clinicName,
        primaryColor: data.primary_color || fallbackConfig.primaryColor,
        contactPhone: data.contact_phone || fallbackConfig.contactPhone,
        contactEmail: data.contact_email || fallbackConfig.contactEmail,
        defaultServices: fallbackConfig.defaultServices, // To be loaded from features/services table later if needed
        siteUrl: data.domain ? `https://${data.domain}` : fallbackConfig.siteUrl,
        googleMapsUrl: data.google_maps_url || fallbackConfig.googleMapsUrl,
        instagramUrl: data.instagram_url || fallbackConfig.instagramUrl,
        facebookUrl: data.facebook_url || fallbackConfig.facebookUrl,
      };
    },
    ['tenant-config', slug],
    { revalidate: 60, tags: ['tenant'] }
  )(slug);
}
