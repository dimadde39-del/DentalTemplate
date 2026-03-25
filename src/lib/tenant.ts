import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { supabaseAnon } from '@/lib/supabase-server';
import { siteConfig as fallbackConfig, SiteConfig } from '@/config/site';
import { getClinicSiteUrl } from '@/lib/site-url';
import { resolveClinicVariant } from '@/lib/tenant/variants';

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

type PublicClinicTheme = Partial<{
  variant: string | null;
  accent: string | null;
  accent2: string | null;
  bg: string | null;
  logo_url: string | null;
  font_family: string | null;
}>;

type AdminThemeSettingRow = {
  key: string;
  value: string | null;
};

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getClinicThemeData(slug: string): Promise<{
  theme: PublicClinicTheme | null;
  variantSetting: string | null;
}> {
  const supabase = createAdminClient();
  if (!supabase) {
    return {
      theme: null,
      variantSetting: null,
    };
  }

  const { data: clinicRow, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (clinicError || !clinicRow || typeof clinicRow !== 'object') {
    return {
      theme: null,
      variantSetting: null,
    };
  }

  const clinicRecord = clinicRow as Record<string, unknown>;
  const rawTheme = clinicRecord.theme;
  const theme =
    rawTheme && typeof rawTheme === 'object' ? (rawTheme as PublicClinicTheme) : null;

  if (theme?.variant) {
    return {
      theme,
      variantSetting: null,
    };
  }

  const clinicId = typeof clinicRecord.id === 'string' ? clinicRecord.id : null;
  if (!clinicId) {
    return {
      theme,
      variantSetting: null,
    };
  }

  const { data: settingRows, error: settingsError } = await supabase
    .from('settings')
    .select('key, value')
    .eq('clinic_id', clinicId)
    .eq('key', 'theme_variant')
    .limit(1);

  if (settingsError) {
    return {
      theme,
      variantSetting: null,
    };
  }

  const setting = (settingRows?.[0] ?? null) as AdminThemeSettingRow | null;

  return {
    theme,
    variantSetting: setting?.value?.trim() || null,
  };
}

export async function getSiteConfig(slug: string): Promise<SiteConfig | null> {
  return unstable_cache(
    async (slug: string) => {
      if (slug === 'default') return fallbackConfig;

      const { data, error } = await supabaseAnon.rpc('get_clinic_public_data', { p_slug: slug });

      if (error || !data) return null;

      const clinic = data.clinic;
      if (!clinic) return null;
      const rpcTheme =
        clinic.theme && typeof clinic.theme === "object"
          ? (clinic.theme as PublicClinicTheme)
          : null;
      const { theme, variantSetting } =
        rpcTheme?.variant || rpcTheme?.accent ? { theme: rpcTheme, variantSetting: null } : await getClinicThemeData(slug);
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
        theme: {
          ...(fallbackConfig.theme ?? {}),
          ...(theme ?? {}),
          variant: resolveClinicVariant(
            theme?.variant ?? variantSetting ?? fallbackConfig.theme?.variant
          ),
          accent:
            theme?.accent?.trim() || clinic.primary_color || fallbackConfig.primaryColor,
        },
      };
    },
    ['tenant-config', slug],
    { revalidate: 60, tags: ['tenant'] }
  )(slug);
}
