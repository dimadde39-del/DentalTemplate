import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof _createBrowserClient> | null = null;

/**
 * Single source of truth for browser-side Supabase client.
 * Used in: "use client" components (BookingModal, Login, etc.)
 * Singleton pattern prevents "Multiple GoTrueClient instances" warning.
 */
export function createBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  );
  return browserClient;
}
