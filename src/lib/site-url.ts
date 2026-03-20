export function normalizeHost(value?: string | null): string {
  if (!value) return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
}

export function getPlatformOrigin(): string {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitSiteUrl) return explicitSiteUrl.replace(/\/$/, "");

  const platformDomain = normalizeHost(process.env.NEXT_PUBLIC_PLATFORM_DOMAIN);
  if (platformDomain) {
    return `https://${platformDomain}`;
  }

  return "http://localhost:3000";
}

interface ClinicSiteUrlOptions {
  readonly slug?: string | null;
  readonly domain?: string | null;
  readonly requestHost?: string | null;
  readonly protocol?: string | null;
  readonly pathPrefix?: string | null;
}

export function getClinicSiteUrl({
  slug,
  domain,
  requestHost,
  protocol,
  pathPrefix,
}: ClinicSiteUrlOptions): string {
  const normalizedPathPrefix =
    pathPrefix && pathPrefix !== "/"
      ? `/${pathPrefix.replace(/^\/+/, "").replace(/\/+$/, "")}`
      : "";
  const normalizedRequestHost = normalizeHost(requestHost);
  if (normalizedRequestHost) {
    const resolvedProtocol =
      protocol ||
      (normalizedRequestHost.includes("localhost") || normalizedRequestHost.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${resolvedProtocol}://${normalizedRequestHost}${normalizedPathPrefix}`;
  }

  const normalizedDomain = normalizeHost(domain);
  if (normalizedDomain) {
    return `https://${normalizedDomain}${normalizedPathPrefix}`;
  }

  const normalizedSlug = slug?.trim().toLowerCase();
  const platformDomain = normalizeHost(process.env.NEXT_PUBLIC_PLATFORM_DOMAIN);
  if (normalizedSlug && platformDomain) {
    return `https://${normalizedSlug}.${platformDomain}${normalizedPathPrefix}`;
  }

  return `${getPlatformOrigin()}${normalizedPathPrefix}`;
}
