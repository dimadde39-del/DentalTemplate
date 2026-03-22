import { unstable_cache } from 'next/cache';
import { supabaseAnon } from '@/lib/supabase-server';
import { siteConfig as fallbackConfig, SiteConfig } from '@/config/site';
import { getClinicSiteUrl } from '@/lib/site-url';

type PublicContent = Partial<{
  hero_title: string;
  hero_subtitle: string;
  services_title: string;
  services_subtitle: string;
  doctors_title: string;
  doctors_subtitle: string;
  testimonials_title: string;
  testimonials_subtitle: string;
}>;

export async function getSiteConfig(slug: string): Promise<SiteConfig | null> {
  return unstable_cache(
    async (slug: string) => {
      if (slug === 'default') return fallbackConfig;

      const { data, error } = await supabaseAnon.rpc('get_clinic_public_data', { p_slug: slug });

      if (error || !data) return null;

      const clinic = data.clinic;
      if (!clinic) return null;
      const content =
        data.content && typeof data.content === "object" ? (data.content as PublicContent) : {};
      const clinicName = clinic.name || fallbackConfig.clinicName;

      return {
        clinicName,
        primaryColor: clinic.primary_color || fallbackConfig.primaryColor,
        contactPhone: clinic.contact_phone || fallbackConfig.contactPhone,
        contactEmail: clinic.contact_email || fallbackConfig.contactEmail,
        domain: clinic.domain || null,
        heroTitle: content.hero_title || `Premium Care at ${clinicName}`,
        heroSubtitle: content.hero_subtitle || fallbackConfig.heroSubtitle,
        servicesTitle: content.services_title || fallbackConfig.servicesTitle,
        servicesSubtitle: content.services_subtitle || fallbackConfig.servicesSubtitle,
        doctorsTitle: content.doctors_title || fallbackConfig.doctorsTitle,
        doctorsSubtitle: content.doctors_subtitle || fallbackConfig.doctorsSubtitle,
        testimonialsTitle: content.testimonials_title || fallbackConfig.testimonialsTitle,
        testimonialsSubtitle:
          content.testimonials_subtitle || fallbackConfig.testimonialsSubtitle,
        services: data.services || [],
        doctors: data.doctors || [],
        reviews: data.reviews || [],
        siteUrl: getClinicSiteUrl({
          slug: clinic.slug || slug,
          domain: clinic.domain,
        }),
        googleMapsUrl: clinic.google_maps_url || fallbackConfig.googleMapsUrl,
        instagramUrl: clinic.instagram_url || fallbackConfig.instagramUrl,
        facebookUrl: clinic.facebook_url || fallbackConfig.facebookUrl,
      };
    },
    ['tenant-config', slug],
    { revalidate: 60, tags: ['tenant'] }
  )(slug);
}
