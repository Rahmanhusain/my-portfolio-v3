import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/data/posts";
import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { renderBlock } from "@/lib/content-blocks";
import TableOfContents from "@/components/ui/TableOfContents";
import ShareLinks from "@/components/ui/ShareLinks";
import CtaBand from "@/components/sections/CtaBand";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/** Rough word count from the body blocks — feeds `wordCount` in the schema,
 *  which is one of the signals Google uses to judge article depth. */
function countWords(post: (typeof posts)[number]): number {
  return post.body.reduce((total, block) => {
    if ("text" in block) return total + block.text.split(/\s+/).length;
    if ("items" in block)
      return total + block.items.join(" ").split(/\s+/).length;
    return total;
  }, 0);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const canonical = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.bannerImage.startsWith("/")
    ? `${siteUrl}${post.bannerImage}`
    : post.bannerImage;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: "Rahman", url: siteUrl }],
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article",
      publishedTime: post.updatedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Rahman"],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.bannerAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      site: site.social.twitterHandle,
      creator: site.social.twitterHandle,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];
  if (!post) notFound();

  const canonical = `${siteUrl}/blog/${post.slug}`;
  const isoDate = post.updatedAt.toISOString();
  const image = post.bannerImage.startsWith("/")
    ? `${siteUrl}${post.bannerImage}`
    : post.bannerImage;

  // `posts` is sorted newest-first, so "next" is the newer neighbour.
  const newer = posts[index - 1];
  const older = posts[index + 1];

  // Related by shared tags, falling back to the most recent other posts so the
  // section is never empty.
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((entry) => entry.post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    headline: post.title,
    description: post.description,
    keywords: post.keywords.join(", "),
    articleSection: post.tags[0],
    wordCount: countWords(post),
    datePublished: isoDate,
    dateModified: isoDate,
    url: canonical,
    image,
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}/blog#blog` },
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
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
      {/* Doubles as a reading-progress indicator on long articles */}
      <ScrollProgress />

      <article className="min-h-screen pb-20">
        {/* Banner image */}
        <div className="relative mt-14 sm:mt-14.5 w-full aspect-21/8 sm:aspect-21/4.5  max-h-80 overflow-hidden bg-bg">
          <Image
            src={post.bannerImage}
            alt={post.bannerAlt}
            fill
            priority
            className="object-cover sm:object-fit"
            sizes="100vw"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" /> */}
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mt-10 mb-10 flex flex-wrap items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-fg">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="line-clamp-1 text-fg">{post.title}</span>
          </nav>

          {/* Post header */}
          <header className="mb-10">
            <div className="mb-5 flex items-center gap-3 text-xs text-muted">
              <time dateTime={isoDate.split("T")[0]}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="mb-5 font-display text-4xl font-bold leading-tight tracking-tight text-fg md:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg leading-relaxed text-muted">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Byline + share */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/rahman.jpeg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-fg">Rahman</p>
                  <p className="text-xs text-muted">
                    Full-stack developer, {site.location.city}
                  </p>
                </div>
              </div>
              <ShareLinks url={canonical} title={post.title} />
            </div>
          </header>

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10 lg:items-start">
            <div className="mb-10 lg:hidden">
              <TableOfContents body={post.body} />
            </div>

            {/* Rich content */}
            <div className="prose-custom min-w-0">
              {post.body.map((block, i) => renderBlock(block, i))}
            </div>

            <aside className="mt-12 hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <TableOfContents body={post.body} />
            </aside>
          </div>

          {/* Inline conversion prompt — placed where the reader has just got
              value, which is the moment they're most receptive. */}
          <aside className="glow-card mt-14 rounded-2xl border border-border bg-raised p-7">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
              Working on something like this?
            </p>
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight text-fg">
              I build this for a living.
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              If you&apos;d rather have it done than do it yourself, tell me
              what you&apos;re building — I&apos;ll tell you honestly whether
              it&apos;s a good fit and what it would take.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="hover-lift inline-flex items-center rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-strong"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="hover-lift inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg"
              >
                See Services
              </Link>
            </div>
          </aside>

          {/* Prev / next — keeps readers inside the archive */}
          {(newer || older) && (
            <nav
              aria-label="More articles"
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {older ? (
                <Link
                  href={`/blog/${older.slug}`}
                  rel="prev"
                  className="bloom-card group rounded-2xl border border-border p-5 transition-colors duration-200 hover:border-faint"
                >
                  <p className="mb-1.5 text-xs text-muted">← Older</p>
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-fg">
                    {older.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/blog/${newer.slug}`}
                  rel="next"
                  className="bloom-card group rounded-2xl border border-border p-5 text-right transition-colors duration-200 hover:border-faint sm:col-start-2"
                >
                  <p className="mb-1.5 text-xs text-muted">Newer →</p>
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-fg">
                    {newer.title}
                  </p>
                </Link>
              )}
            </nav>
          )}

          {/* Related — internal linking on shared tags */}
          {related.length > 0 && (
            <section aria-labelledby="related-posts-heading" className="mt-14">
              <h2
                id="related-posts-heading"
                className="mb-5 text-xs font-medium uppercase tracking-widest text-muted"
              >
                Related reading
              </h2>
              <ol className="divide-y divide-border border-y border-border">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex items-center justify-between gap-4 py-4 transition-all duration-200 hover:pl-2"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-snug text-fg">
                          <span className="link-sweep">{item.title}</span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {item.readTime}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="arrow-slide shrink-0 text-muted transition-colors group-hover:text-fg"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Footer nav */}
          <div className="mt-14 flex items-center justify-between border-t border-border pt-8">
            <Link
              href="/blog"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              ← Back to all posts
            </Link>
            <Link
              href="/services"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              View Services →
            </Link>
          </div>
        </div>
      </article>

      <CtaBand
        source={`blog-${post.slug}`}
        eyebrow="From reading to shipping"
        title="Want this built properly, without the learning curve?"
        description="Book a free 30-minute call. Bring the problem, leave with a plan — a clear scope, a realistic timeline, and a written quote."
      />

      <BackToTop />
    </>
  );
}
