import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";
import {
  locationLabelFor,
  mailtoFor,
  telHrefFor,
  whatsappHrefFor,
} from "@/lib/site";
import { getSite } from "@/lib/data/site";
import ContactForm from "@/components/ui/ContactForm";
import BookingTrigger from "@/components/ui/BookingTrigger";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

const pageDescription =
  "Get in touch about a web app, custom CRM, e-commerce build, or automation project. Free 30-minute discovery call, written quote, and a reply within one business day.";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();

  return {
  title: "Contact — Let's Build Something Together",
  description: pageDescription,
  keywords: [
    "contact web developer",
    "hire developer",
    "freelance developer",
    "web development inquiry",
    "book a developer call",
    "project collaboration",
  ],
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Contact — Rahman Software Developer",
    description:
      "Have a project in mind? Let's talk about how I can help bring your vision to life.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Rahman Software Developer",
    description:
      "Have a project in mind? Let's talk about how I can help bring your vision to life.",
    site: site.social.twitterHandle,
    creator: site.social.twitterHandle,
  },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteUrl}/contact#page`,
  name: "Contact — Rahman Software Developer",
  description: pageDescription,
  url: `${siteUrl}/contact`,
  isPartOf: { "@id": `${siteUrl}/#website` },
  inLanguage: "en-US",
  mainEntity: { "@id": `${siteUrl}/#business` },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: `${siteUrl}/contact`,
    },
  ],
};

/** Removes the "what happens after I hit send?" anxiety that kills form fills. */
const nextSteps = [
  {
    title: "You send the details",
    body: "The more you share about goals and constraints, the more useful my first reply is.",
  },
  {
    title: "I reply within one business day",
    body: "With honest first thoughts — including if I think it's not a fit or you don't need me.",
  },
  {
    title: "We talk it through",
    body: "A free 30-minute call to scope the work, then a written quote with a fixed price.",
  },
];

export default async function ContactPage() {
  const site = await getSite();

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

      <div className="relative min-h-screen overflow-hidden pt-32 pb-20">
        <div className="aurora" aria-hidden="true" />
        <div className="grid-bg" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition-colors hover:text-fg">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-fg">Contact</span>
          </nav>

          {/* Header */}
          <header className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              Get in Touch
            </p>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-fg md:text-6xl">
              Let&apos;s work together.
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              Have a project in mind or just want to say hello? I&apos;d love to
              hear from you. Fill out the form below and I&apos;ll get back to
              you within one business day.
            </p>
          </header>

          {/* Booking CTA Banner */}
          <div className="glow-card mb-12 rounded-2xl border border-border bg-raised p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="mb-2 font-display text-xl font-semibold tracking-tight text-fg">
                  Prefer to talk first?
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted">
                  Book a free 30-minute discovery call. We&apos;ll discuss your
                  project needs, timeline, and how I can help — no pressure, no
                  sales pitch.
                </p>
              </div>
              <BookingTrigger
                source="contact"
                variant="solid"
                className="cta-halo shrink-0 cursor-pointer px-6 py-3"
              >
                Book a Free 30-Minute Call
              </BookingTrigger>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column - Contact Methods */}
            <div className="space-y-8 lg:col-span-4">
              <section>
                <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-fg">
                  Direct Contact
                </h2>
                <div className="space-y-3">
                  <a
                    href={mailtoFor(site)}
                    className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border transition-colors group-hover:border-faint">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 4h16c1.10 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.10 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M22 6l-10 7L2 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="link-sweep truncate">
                      {site.social.email}
                    </span>
                  </a>

                  <a
                    href={telHrefFor(site)}
                    className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border transition-colors group-hover:border-faint">
                      <PhoneIcon />
                    </span>
                    <span className="link-sweep">{site.social.phone}</span>
                  </a>

                  <a
                    href={whatsappHrefFor(site)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border transition-colors group-hover:border-faint">
                      <WhatsAppIcon width={16} height={16} />
                    </span>
                    <span className="link-sweep">WhatsApp</span>
                  </a>
                </div>
              </section>

              <section className="border-t border-border pt-6">
                <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-fg">
                  Availability
                </h2>
                <div className="mb-2 flex items-center gap-2.5 text-sm text-strong">
                  <span className="pulse-dot" aria-hidden="true" />
                  {site.responseTime}.
                </div>
                <p className="text-sm text-muted">{locationLabelFor(site)}</p>
              </section>

              {/* What happens next — removes the black-box feeling */}
              <section className="border-t border-border pt-6">
                <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-fg">
                  What happens next
                </h2>
                <ol className="stagger space-y-4">
                  {nextSteps.map((step, i) => (
                    <li key={step.title} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-faint font-display text-[11px] font-semibold text-fg"
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-fg">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-border bg-bg p-6 md:p-8">
                <h2 className="mb-1 font-display text-xl font-semibold tracking-tight text-fg">
                  Send a Message
                </h2>
                <p className="mb-6 text-sm text-muted">
                  Tell me about your project and I&apos;ll get back to you
                  within one business day.
                </p>
                <ContactForm site={site} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
