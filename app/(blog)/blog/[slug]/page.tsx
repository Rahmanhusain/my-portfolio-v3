import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { posts, type ContentBlock } from '@/lib/data/posts';
import { siteUrl } from '@/lib/seo';

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

// ─── Rich content renderer ───────────────────────────────────────────────────

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mt-10 mb-4">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mt-7 mb-3">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="text-[#8a8a8a] leading-relaxed mb-5">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="mb-5 space-y-2 pl-5 list-disc marker:text-[#3a3a3a]">
          {block.items.map((item, j) => (
            <li key={j} className="text-sm text-[#8a8a8a] leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <div key={i} className="mb-5 rounded-xl overflow-hidden border border-[#242424]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#242424]">
            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-mono">
              {block.lang}
            </span>
          </div>
          <pre className="bg-[#0d0d0d] p-5 overflow-x-auto">
            <code className="text-xs text-[#c9d1d9] font-mono leading-relaxed whitespace-pre">
              {block.code}
            </code>
          </pre>
        </div>
      );
    case 'image':
      return (
        <figure key={i} className="mb-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#242424]">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-[#8a8a8a] text-center mt-3">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'hr':
      return <hr key={i} className="border-[#242424] my-8" />;
    default:
      return null;
  }
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
