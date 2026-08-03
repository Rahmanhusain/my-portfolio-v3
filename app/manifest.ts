import type { MetadataRoute } from 'next';

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
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
