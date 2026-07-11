import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { posts } from '@/lib/data/posts';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.updatedAt.toISOString(),
      authors: ['Rahman'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.updatedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Rahman',
      url: siteUrl,
    },
    url: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-[#8a8a8a] hover:text-[#fafafa] transition-colors mb-12"
          >
            ← All posts
          </Link>

          <header className="mb-12">
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

          <hr className="border-[#242424] mb-12" />

          <div
            className="prose prose-invert prose-sm md:prose-base max-w-none
              prose-headings:font-display prose-headings:tracking-tight prose-headings:text-[#fafafa]
              prose-p:text-[#8a8a8a] prose-p:leading-relaxed
              prose-a:text-[#fafafa] prose-a:underline prose-a:underline-offset-2
              prose-code:text-[#fafafa] prose-code:bg-[#141414] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-pre:bg-[#141414] prose-pre:border prose-pre:border-[#242424]
              prose-hr:border-[#242424]
              prose-strong:text-[#fafafa]"
          >
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# '))
                return (
                  <h1 key={i} className="text-3xl font-bold mt-10 mb-4">
                    {line.slice(2)}
                  </h1>
                );
              if (line.startsWith('## '))
                return (
                  <h2 key={i} className="text-2xl font-semibold mt-8 mb-3">
                    {line.slice(3)}
                  </h2>
                );
              if (line.startsWith('### '))
                return (
                  <h3 key={i} className="text-xl font-semibold mt-6 mb-2">
                    {line.slice(4)}
                  </h3>
                );
              if (line.startsWith('```')) return null;
              if (line.trim() === '') return <br key={i} />;
              return (
                <p key={i} className="text-[#8a8a8a] leading-relaxed mb-4">
                  {line}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-[#242424]">
            <Link
              href="/blog"
              className="text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
