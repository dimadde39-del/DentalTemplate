import { unstable_cache } from 'next/cache';
import { supabaseAnon } from '@/lib/supabase-server';
import { siteConfig as fallbackConfig, SiteConfig } from '@/config/site';

export async function getSiteConfig(slug: string): Promise<SiteConfig> {
  return unstable_cache(
    async (slug: string) => {
      const supabase = supabaseAnon;

      // Fetch clinic config + public data in parallel
      const [clinicResult, publicDataResult] = await Promise.all([
        supabase.from('clinics').select('*').eq('slug', slug).single(),
        supabase.rpc('get_clinic_public_data', { p_slug: slug }),
      ]);

      const data = clinicResult.data;
      const publicData = publicDataResult.data as {
        services: SiteConfig['services'];
        doctors: SiteConfig['doctors'];
        reviews: SiteConfig['reviews'];
      } | null;

      // Fallback to default static config if db query fails or clinic not found
      if (!data) return fallbackConfig;

      return {
        clinicName: data.name || fallbackConfig.clinicName,
        primaryColor: data.primary_color || fallbackConfig.primaryColor,
        contactPhone: data.contact_phone || fallbackConfig.contactPhone,
        contactEmail: data.contact_email || fallbackConfig.contactEmail,
        defaultServices: fallbackConfig.defaultServices,
        services: publicData?.services || [],
        doctors: publicData?.doctors || [],
        reviews: publicData?.reviews || [],
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
