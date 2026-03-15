import { createClient } from '@supabase/supabase-js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .options({
      slug: { type: 'string', demandOption: true, describe: 'The unique slug for the new clinic' },
      name: { type: 'string', demandOption: true, describe: 'The display name of the clinic' },
      domain: { type: 'string', describe: 'The custom domain (e.g., mydental.com)' }
    })
    .help()
    .argv;

  console.log(`🚀 Onboarding new clinic: ${argv.name} (${argv.slug})...`);

  const { data, error } = await supabase.rpc('onboard_new_clinic', {
    p_template_slug: 'template',
    p_new_slug: argv.slug,
    p_new_name: argv.name,
    p_new_domain: argv.domain || null
  });

  if (error) {
    console.error(`❌ Failed to onboard clinic: ${error.message}`);
    process.exit(1);
  }

  console.log('✅ Clinic onboarded successfully!');
  console.log('Template data (services, doctors, reviews) copied atomically.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
