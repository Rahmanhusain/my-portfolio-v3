import type { NextConfig } from "next";

/**
 * Banner and in-body images uploaded through the admin panel live in a public
 * Cloudflare R2 bucket, so `next/image` has to be told that host is allowed.
 *
 * The hostname comes from `R2_PUBLIC_BASE_URL` (the same value the admin panel
 * uses to build public URLs) so the two can never drift apart. When it is
 * unset — a local clone with no R2 — the list is simply empty and the bundled
 * images under `/public` keep working.
 */
function r2RemotePattern() {
  const base = process.env.R2_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  if (!base) return [];

  try {
    const url = new URL(base);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        pathname: '/**',
      },
    ];
  } catch {
    console.warn(`[next.config] R2_PUBLIC_BASE_URL is not a valid URL: ${base}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePattern(),
  },
};

export default nextConfig;
