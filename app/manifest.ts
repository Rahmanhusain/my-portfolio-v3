import type { MetadataRoute } from 'next';

/**
 * The PWA manifest — the install prompt and the Android home-screen icon.
 *
 * Icons point at the real artwork in `public/favicon_io/` rather than the
 * `/icon` and `/apple-icon` routes this used to generate: those routes no
 * longer exist, because `app/icon*.png` and `app/apple-icon.png` replaced the
 * generators. A manifest referencing a dead icon URL fails silently — the
 * install prompt just shows a blank tile — so these two must be kept in step
 * with whatever lives in `app/`.
 *
 * `theme_color` / `background_color` stay on the warm-paper `--color-bg`, not
 * the `#ffffff` that favicon.io's boilerplate ships, so the splash screen
 * matches the site rather than flashing white.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rahman — Software Developer',
    short_name: 'Rahman',
    description:
      'Software Developer building fast, accessible, and beautifully crafted web products. Available for freelance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f2ec',
    theme_color: '#f5f2ec',
    icons: [
      {
        src: '/favicon_io/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon_io/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
