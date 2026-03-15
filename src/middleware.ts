import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = new URL(request.url);
  const systemSubdomains = ['www', 'app', 'admin', 'api', 'login', 'localhost'];

  let slug = null;

  // subdomain routing
  const domainParts = hostname.split('.');
  if (domainParts.length > 2 && !systemSubdomains.includes(domainParts[0])) {
    slug = domainParts[0];
  }
  // path routing
  else if (url.pathname.startsWith('/clinic/')) {
    slug = url.pathname.split('/')[2];
  }

  // Protect /admin routes using @supabase/ssr
  let supabaseResponse = NextResponse.next();
  // Strip incoming tenant spoofing headers before setting our own
  const headers = new Headers(request.headers);
  headers.delete('x-tenant-slug');
  
  if (slug) {
    headers.set('x-tenant-slug', slug);
    supabaseResponse = NextResponse.next({ request: { headers } });
  } else if (url.pathname.startsWith('/clinic/') || hostname.includes('.')) {
    // 404 for unknown tenant
    return NextResponse.redirect(new URL('/404', request.url));
  }

  if (url.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            // To set cookies on the response, we must have a response object
            if (!slug) {
              supabaseResponse = NextResponse.next({ request: { headers } })
            }
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
