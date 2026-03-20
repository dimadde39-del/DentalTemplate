import { createClient } from '@supabase/supabase-js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function normalizeSlug(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeDomain(value?: string | null): string | null {
  if (!value) return null;

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');

  return normalized || null;
}

function getInviteRedirectUrl(slug: string, domain: string | null): string {
  if (domain) return `https://${domain}/admin`;

  const platformDomain = normalizeDomain(process.env.NEXT_PUBLIC_PLATFORM_DOMAIN);
  if (platformDomain) {
    return `https://${slug}.${platformDomain}/admin`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (siteUrl) {
    return `${siteUrl}/admin`;
  }

  return 'http://localhost:3000/admin';
}

async function ensureClinicSlugAvailable(slug: string) {
  const { data, error } = await supabase
    .from('clinics')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to validate clinic slug: ${error.message}`);
  if (data) throw new Error(`Clinic slug already exists: ${slug}`);
}

async function ensureClinicDomainAvailable(domain: string | null) {
  if (!domain) return;

  const { data, error } = await supabase
    .from('clinics')
    .select('id, slug')
    .eq('domain', domain)
    .maybeSingle();

  if (error) throw new Error(`Failed to validate clinic domain: ${error.message}`);
  if (data) throw new Error(`Clinic domain already exists: ${domain}`);
}

async function rollbackClinicProvisioning(clinicId: string) {
  const tables = ['profiles', 'leads', 'settings', 'reviews', 'doctors', 'services'] as const;

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq('clinic_id', clinicId);
    if (error) {
      throw new Error(`Rollback failed for ${table}: ${error.message}`);
    }
  }

  const { error: clinicDeleteError } = await supabase
    .from('clinics')
    .delete()
    .eq('id', clinicId);

  if (clinicDeleteError) {
    throw new Error(`Rollback failed for clinics: ${clinicDeleteError.message}`);
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .options({
      slug: { type: 'string', demandOption: true, describe: 'The unique slug for the new clinic' },
      name: { type: 'string', demandOption: true, describe: 'The display name of the clinic' },
      domain: { type: 'string', describe: 'Optional custom domain, for example clinic.example.com' },
      'admin-email': {
        type: 'string',
        demandOption: true,
        describe: 'Email address for the invited clinic administrator',
      },
    })
    .check((input) => {
      if (!input['admin-email'] || !String(input['admin-email']).includes('@')) {
        throw new Error('A valid --admin-email value is required.');
      }

      return true;
    })
    .help()
    .argv;

  const slug = normalizeSlug(argv.slug);
  const name = argv.name.trim();
  const domain = normalizeDomain(argv.domain);
  const adminEmail = argv['admin-email'].trim().toLowerCase();
  const redirectTo = getInviteRedirectUrl(slug, domain);

  let clinicId: string | null = null;
  let invitedUserId: string | null = null;

  console.log(`Starting clinic onboarding for "${name}" (${slug})`);

  try {
    await ensureClinicSlugAvailable(slug);
    await ensureClinicDomainAvailable(domain);

    const { data: onboardedClinicId, error: onboardError } = await supabase.rpc('onboard_new_clinic', {
      p_template_slug: 'template',
      p_new_slug: slug,
      p_new_name: name,
      p_new_domain: domain,
    });

    if (onboardError || !onboardedClinicId) {
      throw new Error(onboardError?.message || 'Clinic provisioning RPC returned no clinic id.');
    }

    clinicId = onboardedClinicId;

    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      adminEmail,
      {
        data: {
          clinic_id: clinicId,
          clinic_slug: slug,
          role: 'clinic_admin',
        },
        redirectTo,
      }
    );

    invitedUserId = inviteData.user?.id ?? null;

    if (inviteError || !invitedUserId) {
      throw new Error(inviteError?.message || 'Invite flow did not return a user id.');
    }

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        user_id: invitedUserId,
        clinic_id: clinicId,
        role: 'clinic_admin',
      },
      {
        onConflict: 'user_id',
      }
    );

    if (profileError) {
      throw new Error(profileError.message);
    }

    console.log('Clinic onboarding completed successfully.');
    console.log(`Clinic ID: ${clinicId}`);
    console.log(`Clinic slug: ${slug}`);
    console.log(`Invited admin: ${adminEmail}`);
    console.log(`Domain attached: ${domain ?? 'no custom domain'}`);
    console.log(`Invite redirect: ${redirectTo}`);
  } catch (error) {
    console.error(`Onboarding failed: ${(error as Error).message}`);

    if (invitedUserId) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(invitedUserId);
      if (deleteUserError) {
        console.error(`Warning: failed to delete invited user during rollback: ${deleteUserError.message}`);
      }
    }

    if (clinicId) {
      try {
        await rollbackClinicProvisioning(clinicId);
        console.error(`Rollback completed for clinic ${clinicId}.`);
      } catch (rollbackError) {
        console.error(`Rollback failed: ${(rollbackError as Error).message}`);
      }
    }

    console.error(`Result: rollback ${clinicId ? 'attempted' : 'not needed'}.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
