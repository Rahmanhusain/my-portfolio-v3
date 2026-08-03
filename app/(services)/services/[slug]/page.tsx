import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data/services";
import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { renderBlock } from "@/lib/content-blocks";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/sections/CtaBand";
import BookingTrigger from "@/components/ui/BookingTrigger";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  const canonical = `${siteUrl}/services/${service.slug}`;
  const ogImage = service.bannerImage.startsWith("/")
    ? `${siteUrl}${service.bannerImage}`
    : service.bannerImage;

  return {
    title: `${service.title} — Services`,
    description: service.shortDesc,
    keywords: service.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${service.title} by Rahman`,
      description: service.shortDesc,
      url: canonical,
      type: "website",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: service.bannerAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} by Rahman`,
      description: service.shortDesc,
      images: [ogImage],
      site: site.social.twitterHandle,
      creator: site.social.twitterHandle,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const canonical = `${siteUrl}/services/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: service.title,
    description: service.description,
    url: canonical,
    image: service.bannerImage.startsWith("/")
      ? `${siteUrl}${service.bannerImage}`
      : service.bannerImage,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: "Worldwide",
    serviceType: service.title,
    // The benefits are the concrete deliverables — modelling them as an offer
    // catalogue is what makes this eligible for service rich results.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} — what's included`,
      itemListElement: service.benefits.map((benefit) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: benefit.title,
          description: benefit.description,
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: canonical,
      },
    ],
  };

  // Sibling services for internal linking (exclude current)
  const related = services.filter((s) => s.slug !== slug);

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
        {/* Banner */}
        <div className="relative mt-14 sm:mt-14.5 w-full sm:aspect-21/4.5 aspect-21/8 max-h-80 overflow-hidden bg-bg">
          <Image
            src={service.bannerImage}
            alt={service.bannerAlt}
            fill
            priority
            className="object-fit"
            sizes="100vw"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" /> */}
        </div>

        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mt-10 mb-10 flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/services"
              className="transition-colors hover:text-fg"
            >
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-fg">{service.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              {service.number}
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-fg md:text-5xl">
              {service.title}
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              {service.description}
            </p>

            {/* Early CTA — catches the visitor who's already sold */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookingTrigger
                source={`service-${service.slug}-top`}
                variant="solid"
                className="cursor-pointer px-6 py-3"
              >
                Book a Free Call
              </BookingTrigger>
              <span className="text-xs text-muted">{site.responseTime}</span>
            </div>
          </header>

          <hr className="mb-12 border-border" />

          {/* Rich body content */}
          {service.body.length > 0 && (
            <div className="reveal mb-14">
              {service.body.map((block, i) => renderBlock(block, i))}
            </div>
          )}

          {/* Benefits */}
          <section aria-labelledby="benefits-heading" className="mb-14">
            <h2
              id="benefits-heading"
              className="mb-8 font-display text-2xl font-semibold tracking-tight text-fg"
            >
              What you get
            </h2>
            <div className="stagger grid grid-cols-1 gap-6 md:grid-cols-2">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="glow-card rounded-2xl border border-border bg-raised p-6"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-faint text-fg"
                    >
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 7.5l3.2 3.2L12 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="font-display text-base font-semibold tracking-tight text-fg">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Why me */}
          <section aria-labelledby="why-heading" className="mb-14">
            <h2
              id="why-heading"
              className="mb-5 font-display text-2xl font-semibold tracking-tight text-fg"
            >
              Why work with me
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {service.whyMe}
            </p>
          </section>

          {/* Related services — internal linking */}
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mb-4">
              <h2
                id="related-heading"
                className="mb-6 font-display text-lg font-semibold tracking-tight text-fg"
              >
                Other services
              </h2>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between bg-bg px-6 py-5 transition-colors duration-200 hover:bg-raised"
                  >
                    <div>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-subtle">
                        {s.number}
                      </p>
                      <p className="text-sm font-semibold tracking-tight text-fg">
                        <span className="link-sweep">{s.title}</span>
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

          <Faq faqs={service.faq} />
        </div>
      </div>

      <CtaBand
        source={`service-${service.slug}`}
        eyebrow="Ready when you are"
        title={`Let's scope your ${service.title.toLowerCase()} project.`}
        description="Bring your requirements, your constraints, or just a rough idea. Thirty minutes, a clear plan, and a written quote — no obligation either way."
      />

      <BackToTop />
    </>
  );
}
