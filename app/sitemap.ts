import type { MetadataRoute } from 'next';
import { posts } from '@/lib/data/posts';
import { services } from '@/lib/data/services';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  // One shared timestamp so every static route reports the same build time
  // instead of drifting by milliseconds.
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    // Image sitemap entries help the banners surface in Google Images.
    images: [
      service.bannerImage.startsWith('/')
        ? `${siteUrl}${service.bannerImage}`
        : service.bannerImage,
    ],
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    images: [
      post.bannerImage.startsWith('/')
        ? `${siteUrl}${post.bannerImage}`
        : post.bannerImage,
    ],
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
