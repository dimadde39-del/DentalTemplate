import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuthenticated = false;

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getUser();
    isAuthenticated = !error && Boolean(data.user);
  } catch {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <>{children}</>;
}
