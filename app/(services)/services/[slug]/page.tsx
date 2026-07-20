import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data/services';
import { siteUrl } from '@/lib/seo';
import { renderBlock } from '@/lib/content-blocks';
import Faq from '@/components/sections/Faq';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  const canonical = `${siteUrl}/services/${service.slug}`;
  const ogImage   = service.bannerImage.startsWith('/')
    ? `${siteUrl}${service.bannerImage}`
    : service.bannerImage;

  return {
    title:       `${service.title} — Services`,
    description: service.shortDesc,
    keywords:    service.keywords,
    alternates:  { canonical },
    openGraph: {
      title:       `${service.title} by Rahman`,
      description: service.shortDesc,
      url:         canonical,
      type:        'website',
      images:      [{ url: ogImage, width: 1200, height: 630, alt: service.bannerAlt }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${service.title} by Rahman`,
      description: service.shortDesc,
      images:      [ogImage],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const canonical = `${siteUrl}/services/${service.slug}`;

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'Service',
    name:         service.title,
    description:  service.description,
    url:          canonical,
    provider: {
      '@type': 'Person',
      name:    'Rahman',
      url:     siteUrl,
    },
    areaServed:   'Worldwide',
    serviceType:  service.title,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: canonical },
    ],
  };

  // Sibling services for internal linking (exclude current)
  const related = services.filter((s) => s.slug !== slug).slice(0);

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

      <div className="min-h-screen pb-20">
        {/* Banner */}
        <div className="relative w-full sm:aspect-21/4.5 aspect-21/8 max-h-100  overflow-hidden bg-bg">
          <Image
            src={service.bannerImage}
            alt={service.bannerAlt}
            fill
            priority
            className="object-fit"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8a8a8a] mt-10 mb-10">
            <Link href="/services" className="hover:text-[#fafafa] transition-colors">
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#fafafa]">{service.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
              {service.number}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#fafafa] tracking-tight leading-tight mb-6">
              {service.title}
            </h1>
            <p className="text-[#8a8a8a] text-lg leading-relaxed">
              {service.description}
            </p>
          </header>

          <hr className="border-[#242424] mb-12" />

          {/* Rich body content */}
          {service.body.length > 0 && (
            <div className="mb-14">
              {service.body.map((block, i) => renderBlock(block, i))}
            </div>
          )}

          {/* Benefits */}
          <section aria-labelledby="benefits-heading" className="mb-14">
            <h2
              id="benefits-heading"
              className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mb-8"
            >
              What you get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-6 bg-[#141414] rounded-2xl border border-[#242424]"
                >
                  <h3 className="font-display text-base font-semibold text-[#fafafa] mb-2 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#8a8a8a] leading-relaxed">
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
              className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mb-5"
            >
              Why work with me
            </h2>
            <p className="text-[#8a8a8a] leading-relaxed text-base">
              {service.whyMe}
            </p>
          </section>

          {/* CTA */}
          <div className="p-8 bg-[#141414] rounded-2xl border border-[#242424] mb-14">
            <h2 className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mb-2">
              Ready to get started?
            </h2>
            <p className="text-sm text-[#8a8a8a] mb-6">
              Tell me about your project and I will get back to you within one
              business day.
            </p>
            <a
              href="mailto:hello@yourname.dev"
              className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-[#fafafa] border border-white/[0.12] px-6 py-3 rounded-full hover:bg-[#fafafa] hover:text-[#0a0a0a] hover:border-transparent transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>

          {/* Related services — internal linking */}
          {related.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2
                id="related-heading"
                className="font-display text-lg font-semibold text-[#fafafa] tracking-tight mb-6"
              >
                Other services
              </h2>
              <div className="divide-y divide-[#242424] border border-[#242424] rounded-2xl overflow-hidden">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] hover:bg-[#141414] transition-colors duration-200 group"
                  >
                    <div>
                      <p className="text-[10px] font-medium tracking-widest uppercase text-[#3a3a3a] mb-1">
                        {s.number}
                      </p>
                      <p className="text-sm font-semibold text-[#fafafa] tracking-tight">
                        {s.title}
                      </p>
                    </div>
                    <span className="text-[#8a8a8a] group-hover:text-[#fafafa] transition-colors text-sm">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <Faq />
        </div>
      </div>
    </>
  );
}
