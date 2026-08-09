import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/data/posts';
import { getServices } from '@/lib/data/services';
import { getProjects } from '@/lib/data/projects';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    getPosts(),
  ]);

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
      url: `${siteUrl}/projects`,
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

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    // `images` is omitted rather than empty for projects without a banner —
    // an empty array would emit a stray, meaningless <image:image> block.
    ...(project.bannerImage && {
      images: [
        project.bannerImage.startsWith('/')
          ? `${siteUrl}${project.bannerImage}`
          : project.bannerImage,
      ],
    }),
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

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...postRoutes];
}
