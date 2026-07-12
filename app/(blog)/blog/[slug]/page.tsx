import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { posts } from '@/lib/data/posts';
import { siteUrl } from '@/lib/seo';
import { renderBlock } from '@/lib/content-blocks';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const canonical = `${siteUrl}/blog/${post.slug}`;
  const ogImage   = post.bannerImage.startsWith('/')
    ? `${siteUrl}${post.bannerImage}`
    : post.bannerImage;

  return {
    title:       post.title,
    description: post.description,
    keywords:    post.keywords,
    alternates:  { canonical },
    openGraph: {
      title:         post.title,
      description:   post.description,
      url:           canonical,
      type:          'article',
      publishedTime: post.updatedAt.toISOString(),
      modifiedTime:  post.updatedAt.toISOString(),
      authors:       ['Rahman'],
      tags:          post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.bannerAlt }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.description,
      images:      [ogImage],
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const canonical = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'BlogPosting',
    headline:      post.title,
    description:   post.description,
    keywords:      post.keywords.join(', '),
    datePublished: post.updatedAt.toISOString(),
    dateModified:  post.updatedAt.toISOString(),
    url:           canonical,
    image:         post.bannerImage.startsWith('/')
                     ? `${siteUrl}${post.bannerImage}`
                     : post.bannerImage,
    author: {
      '@type': 'Person',
      name:    'Rahman',
      url:     siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name:    'Rahman',
      url:     siteUrl,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="min-h-screen pb-20">
        {/* Banner image */}
        <div className="relative w-full aspect-[21/9] max-h-[480px] overflow-hidden mb-0">
          <Image
            src={post.bannerImage}
            alt={post.bannerAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        <div className="max-w-2xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-[#8a8a8a] hover:text-[#fafafa] transition-colors mt-10 mb-10"
          >
            ← All posts
          </Link>

          {/* Post header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 text-xs text-[#8a8a8a] mb-5">
              <time dateTime={post.updatedAt.toISOString().split('T')[0]}>
                {post.date}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#fafafa] tracking-tight leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-[#8a8a8a] text-lg leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-[#242424] text-[#8a8a8a]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <hr className="border-[#242424] mb-10" />

          {/* Rich content */}
          <div className="prose-custom">
            {post.body.map((block, i) => renderBlock(block, i))}
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-[#242424] flex items-center justify-between">
            <Link
              href="/blog"
              className="text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors"
            >
              ← Back to all posts
            </Link>
            <Link
              href="/services"
              className="text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors"
            >
              View Services →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
