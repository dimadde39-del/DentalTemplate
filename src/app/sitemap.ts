import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getClinicSiteUrl } from '@/lib/site-url';

type SitemapClinic = {
  slug: string;
  domain: string | null;
  created_at: string | null;
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

async function getSitemapClinics(): Promise<SitemapClinic[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('clinics')
    .select('slug, domain, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load clinics for sitemap:', error.message);
    return [];
  }

  return (data ?? []) as SitemapClinic[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clinics = await getSitemapClinics();

  return clinics.map((clinic) => ({
    url: getClinicSiteUrl({
      slug: clinic.slug,
      domain: clinic.domain,
    }),
    lastModified: clinic.created_at ? new Date(clinic.created_at) : new Date(),
  }));
}
