import { unstable_cache } from 'next/cache';
import { supabaseAnon } from '@/lib/supabase-server';
import { siteConfig as fallbackConfig, SiteConfig } from '@/config/site';

export async function getSiteConfig(slug: string): Promise<SiteConfig> {
  return unstable_cache(
    async (slug: string) => {
      const { data, error } = await supabaseAnon.rpc('get_clinic_public_data', { p_slug: slug });

      if (error || !data) return fallbackConfig;

      const clinic = data.clinic;
      if (!clinic) return fallbackConfig;

      return {
        clinicName: clinic.name || fallbackConfig.clinicName,
        primaryColor: clinic.primary_color || fallbackConfig.primaryColor,
        contactPhone: clinic.contact_phone || fallbackConfig.contactPhone,
        contactEmail: clinic.contact_email || fallbackConfig.contactEmail,
        defaultServices: fallbackConfig.defaultServices,
        services: data.services || [],
        doctors: data.doctors || [],
        reviews: data.reviews || [],
        siteUrl: clinic.domain ? `https://${clinic.domain}` : fallbackConfig.siteUrl,
        googleMapsUrl: clinic.google_maps_url || fallbackConfig.googleMapsUrl,
        instagramUrl: clinic.instagram_url || fallbackConfig.instagramUrl,
        facebookUrl: clinic.facebook_url || fallbackConfig.facebookUrl,
      };
    },
    ['tenant-config', slug],
    { revalidate: 60, tags: ['tenant'] }
  )(slug);
}
