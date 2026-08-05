import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { renderBlock } from "@/lib/content-blocks";
import TableOfContents from "@/components/ui/TableOfContents";
import CtaBand from "@/components/sections/CtaBand";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";

type Props = { params: Promise<{ slug: string }> };

/** First and last initial, for the testimonial avatar plate. Derived rather
 *  than authored so a testimonial only ever needs a name. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const canonical = `${siteUrl}/projects/${project.slug}`;
  // Only projects with their own banner override the generated OG image.
  const ogImage = project.bannerImage
    ? project.bannerImage.startsWith("/")
      ? `${siteUrl}${project.bannerImage}`
      : project.bannerImage
    : undefined;

  return {
    title: `${project.title} — Case Study`,
    description: project.shortDesc,
    keywords: project.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} — Case Study by Rahman`,
      description: project.shortDesc,
      url: canonical,
      type: "article",
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: project.bannerAlt ?? project.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study by Rahman`,
      description: project.shortDesc,
      ...(ogImage && { images: [ogImage] }),
      site: site.social.twitterHandle,
      creator: site.social.twitterHandle,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const canonical = `${siteUrl}/projects/${project.slug}`;

  // External references to this work, if any — dropped entirely when absent so
  // the graph never carries an empty array.
  const sameAs = [project.liveUrl, project.repoUrl].filter(
    (url): url is string => Boolean(url)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonical}#project`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: canonical,
    dateCreated: project.year,
    keywords: project.keywords.join(", "),
    inLanguage: "en-US",
    // The work is mine; the site's Person node already describes me.
    creator: { "@id": `${siteUrl}/#person` },
    author: { "@id": `${siteUrl}/#person` },
    isPartOf: { "@id": `${siteUrl}/#website` },
    ...(project.bannerImage && {
      image: project.bannerImage.startsWith("/")
        ? `${siteUrl}${project.bannerImage}`
        : project.bannerImage,
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: canonical },
    ],
  };

  // Only the facts this project actually carries — a personal build with no
  // client or fixed timeline simply renders fewer pairs.
  const meta = [
    { label: "Year", value: project.year },
    { label: "Timeline", value: project.duration },
    { label: "Role", value: project.role },
    { label: "Client", value: project.client },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value)
  );

  // Sibling projects for internal linking (exclude current)
  const related = projects.filter((p) => p.slug !== slug);

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
      <ScrollProgress />

      <div className="min-h-screen pb-20">
        {/* Banner — the real image when there is one, otherwise a plate at the
            same height so header spacing doesn't shift between projects. */}
        <div className="relative mt-14 sm:mt-14.5 w-full sm:aspect-21/4.5 aspect-21/8 max-h-80 overflow-hidden bg-bg">
          {project.bannerImage ? (
            <Image
              src={project.bannerImage}
              alt={project.bannerAlt ?? project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#dfe3f2] via-raised to-bg"
                aria-hidden="true"
              />
              <div className="grid-bg" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-8xl font-bold select-none text-fg opacity-[0.08] md:text-9xl"
                  aria-hidden="true"
                >
                  {project.number}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mt-10 mb-10 flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/projects" className="transition-colors hover:text-fg">
              Projects
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-fg">{project.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              Case Study {project.number}
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-fg md:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted">
              {project.description}
            </p>

            {/* Tags */}
            <div className="mt-7 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Fact strip */}
            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5 border-t border-border pt-7">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="mb-1 text-[10px] font-medium uppercase tracking-widest text-subtle">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>

            {/* Links — skipped entirely for private work */}
            {(project.liveUrl || project.repoUrl) && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {project.liveUrl && (
                  <MagneticButton
                    as="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="solid"
                  >
                    View Live ↗
                  </MagneticButton>
                )}
                {project.repoUrl && (
                  <MagneticButton
                    as="a"
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source ↗
                  </MagneticButton>
                )}
              </div>
            )}
          </header>

          <hr className="mb-12 border-border" />

          {/* Results — the outcome up front, before the reader has to earn it */}
          {project.results && project.results.length > 0 && (
            <section aria-labelledby="results-heading" className="mb-14">
              <h2
                id="results-heading"
                className="mb-8 font-display text-2xl font-semibold tracking-tight text-fg"
              >
                Outcome
              </h2>
              <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {project.results.map((result) => (
                  <div
                    key={result.label}
                    className="glow-card rounded-2xl border border-border bg-raised p-6"
                  >
                    <p className="mb-2 font-display text-3xl font-bold tracking-tight text-fg">
                      {result.metric}
                    </p>
                    <p className="text-sm leading-relaxed text-muted">
                      {result.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Challenge / Solution */}
          <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2">
            <section aria-labelledby="challenge-heading">
              <h2
                id="challenge-heading"
                className="mb-5 font-display text-2xl font-semibold tracking-tight text-fg"
              >
                The problem
              </h2>
              <p className="text-base leading-relaxed text-muted">
                {project.challenge}
              </p>
            </section>
            <section aria-labelledby="solution-heading">
              <h2
                id="solution-heading"
                className="mb-5 font-display text-2xl font-semibold tracking-tight text-fg"
              >
                What I built
              </h2>
              <p className="text-base leading-relaxed text-muted">
                {project.solution}
              </p>
            </section>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10 lg:items-start">
            <div className="mb-10 lg:hidden">
              <TableOfContents body={project.body} heading="On this page" />
            </div>

            {/* Rich body content */}
            {project.body.length > 0 && (
              <div className="reveal mb-14 min-w-0">
                {project.body.map((block, i) => renderBlock(block, i))}
              </div>
            )}

            <aside className="mt-12 hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <TableOfContents body={project.body} heading="On this page" />
            </aside>
          </div>

          {/* Stack */}
          {project.stack.length > 0 && (
            <section aria-labelledby="stack-heading" className="mb-14">
              <h2
                id="stack-heading"
                className="mb-8 font-display text-2xl font-semibold tracking-tight text-fg"
              >
                What it&apos;s built with
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {project.stack.map((group) => (
                  <div key={group.group}>
                    <h3 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-subtle">
                      {group.group}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-border bg-raised px-3 py-1.5 text-xs text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial — only when the client gave one */}
          {project.testimonial && (
            <section aria-labelledby="testimonial-heading" className="mb-14">
              <h2 id="testimonial-heading" className="sr-only">
                What the client said
              </h2>
              <figure className="glow-card relative overflow-hidden rounded-2xl border border-border bg-raised p-8 md:p-10">
                {/* Watermark quote mark — matches TestimonialCard */}
                <svg
                  viewBox="0 0 32 24"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 right-6 h-24 w-28 text-faint opacity-40"
                >
                  <path
                    d="M0 24V14.4C0 10.4 0.96 7.2 2.88 4.8C4.8 2.4 7.36 0.96 10.56 0.48L11.52 2.88C9.44 3.52 7.84 4.64 6.72 6.24C5.6 7.84 5.04 9.6 5.04 11.52H10.08V24H0ZM17.92 24V14.4C17.92 10.4 18.88 7.2 20.8 4.8C22.72 2.4 25.28 0.96 28.48 0.48L29.44 2.88C27.36 3.52 25.76 4.64 24.64 6.24C23.52 7.84 22.96 9.6 22.96 11.52H28V24H17.92Z"
                    fill="currentColor"
                  />
                </svg>

                <blockquote className="relative font-display text-xl leading-relaxed tracking-tight text-strong md:text-2xl">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3.5 border-t border-border pt-6">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-faint bg-gradient-to-br from-[#dfe3f2] to-[#eef0f8] text-xs font-semibold text-strong"
                    aria-hidden="true"
                  >
                    {initials(project.testimonial.author)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold tracking-tight text-fg">
                      {project.testimonial.author}
                    </span>
                    {project.testimonial.role && (
                      <span className="block truncate text-xs text-subtle">
                        {project.testimonial.role}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </section>
          )}

          {/* Related projects — internal linking */}
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mb-4">
              <h2
                id="related-heading"
                className="mb-6 font-display text-lg font-semibold tracking-tight text-fg"
              >
                Other projects
              </h2>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group flex items-center justify-between gap-6 bg-bg px-6 py-5 transition-colors duration-200 hover:bg-raised"
                  >
                    <div>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-subtle">
                        {p.number} · {p.year}
                      </p>
                      <p className="text-sm font-semibold tracking-tight text-fg">
                        <span className="link-sweep">{p.title}</span>
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="arrow-slide text-sm text-muted transition-colors group-hover:text-fg"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <CtaBand
        source={`project-${project.slug}`}
        eyebrow="Something similar in mind?"
        title={`Let's talk about your ${project.tags[0]?.toLowerCase() ?? "next"} build.`}
        description="Thirty minutes, no obligation. Bring the problem and I'll tell you what it takes to solve it — scope, timeline, and a written quote."
      />

      <BackToTop />
    </>
  );
}
