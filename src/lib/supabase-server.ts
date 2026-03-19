import { createServerClient as _createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Authenticated server client with cookies (JWT).
 * Used in: Server Components, Server Actions, layout auth checks.
 * RLS policies enforce tenant isolation via current_clinic_id().
 * Creates a NEW client per call (required — each request has different cookies).
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  return _createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
}

/**
 * Module-level singleton anonymous client.
 * Used ONLY in tenant.ts for public clinic config + get_clinic_public_data RPC.
 * Singleton prevents connection pool exhaustion on cold deploys (1 client per serverless instance).
 */
export const supabaseAnon = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
