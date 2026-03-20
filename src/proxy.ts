import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { getClinicSiteUrl, normalizeHost } from '@/lib/site-url';

const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'admin', 'api', 'login']);
const SYSTEM_PATHS = ['/admin', '/login', '/404'];
const PLATFORM_DOMAIN = normalizeHost(process.env.NEXT_PUBLIC_PLATFORM_DOMAIN);

const proxySupabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

function isSystemPath(pathname: string): boolean {
  return SYSTEM_PATHS.some((path) => pathname.startsWith(path));
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  );
}

function isPlatformHost(hostname: string): boolean {
  if (!hostname) return true;
  if (isLocalHost(hostname)) return true;
  if (!PLATFORM_DOMAIN) return false;

  return hostname === PLATFORM_DOMAIN || hostname.endsWith(`.${PLATFORM_DOMAIN}`);
}

function getPlatformSubdomain(hostname: string): string | null {
  if (!PLATFORM_DOMAIN || !hostname.endsWith(`.${PLATFORM_DOMAIN}`) || hostname === PLATFORM_DOMAIN) {
    return null;
  }

  const candidate = hostname.slice(0, -(PLATFORM_DOMAIN.length + 1));
  if (!candidate || candidate.includes('.') || RESERVED_SUBDOMAINS.has(candidate)) {
    return null;
  }

  return candidate;
}

function getPathTenantSlug(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'clinic' || !segments[1]) return null;

  return segments[1].toLowerCase();
}

function buildTenantRewriteUrl(request: NextRequest): URL {
  const rewrittenUrl = request.nextUrl.clone();
  const segments = rewrittenUrl.pathname.split('/').filter(Boolean);
  const remainder = segments.slice(2);

  rewrittenUrl.pathname = remainder.length > 0 ? `/${remainder.join('/')}` : '/';

  return rewrittenUrl;
}

async function resolveCustomDomainSlug(hostname: string): Promise<string | null> {
  if (!proxySupabase || !hostname || isPlatformHost(hostname)) return null;

  const { data, error } = await proxySupabase.rpc('resolve_clinic_host', { p_host: hostname });
  if (error) {
    console.error('Failed to resolve clinic host:', error.message);
    return null;
  }

  return typeof data === 'string' && data.trim() ? data.trim().toLowerCase() : null;
}

export async function proxy(request: NextRequest) {
  const hostname = normalizeHost(request.headers.get('x-forwarded-host') ?? request.headers.get('host'));
  const protocol =
    request.headers.get('x-forwarded-proto') ??
    (isLocalHost(hostname) ? 'http' : 'https');
  const pathname = request.nextUrl.pathname;
  const isSystemRoute = isSystemPath(pathname);
  const pathSlug = getPathTenantSlug(pathname);
  const subdomainSlug = getPlatformSubdomain(hostname);
  const customDomainSlug = await resolveCustomDomainSlug(hostname);

  const slug = customDomainSlug ?? subdomainSlug ?? pathSlug;
  const resolvedViaPath = !customDomainSlug && !subdomainSlug && Boolean(pathSlug);

  const headers = new Headers(request.headers);
  headers.delete('x-tenant-slug');
  headers.delete('x-tenant-path-prefix');
  headers.delete('x-tenant-site-url');

  let response =
    slug && resolvedViaPath
      ? NextResponse.rewrite(buildTenantRewriteUrl(request), { request: { headers } })
      : NextResponse.next({ request: { headers } });

  if (slug) {
    headers.set('x-tenant-slug', slug);

    if (resolvedViaPath) {
      headers.set('x-tenant-path-prefix', `/clinic/${slug}`);
    }

    headers.set(
      'x-tenant-site-url',
      getClinicSiteUrl({
        slug,
        requestHost: hostname,
        protocol,
        pathPrefix: resolvedViaPath ? `/clinic/${slug}` : undefined,
      })
    );

    response =
      slug && resolvedViaPath
        ? NextResponse.rewrite(buildTenantRewriteUrl(request), { request: { headers } })
        : NextResponse.next({ request: { headers } });
  } else {
    const invalidClinicPath = pathname === '/clinic' || pathname.startsWith('/clinic/');

    if (!isSystemRoute && (invalidClinicPath || (!isPlatformHost(hostname) && Boolean(hostname)))) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
