import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { site, locationLabel } from "@/lib/site";
import ContactForm from "@/components/ui/ContactForm";
import BookingTrigger from "@/components/ui/BookingTrigger";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact — Let's Build Something Together",
  description:
    "Get in touch for web development projects, collaborations, or just to say hello. Available for freelance work with quick response times.",
  keywords: [
    "contact web developer",
    "hire developer",
    "freelance developer",
    "web development inquiry",
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
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — Rahman Software Developer",
  description: metadata.description,
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "Person",
    name: "Rahman",
    email: "mailto:hello@yourname.dev",
    url: siteUrl,
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <header className="mb-12 max-w-2xl">
            <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-[#fafafa] tracking-tight leading-tight mb-6">
              Let&apos;s work together.
            </h1>
            <p className="text-[#8a8a8a] leading-relaxed text-lg">
              Have a project in mind or just want to say hello? I&apos;d love to
              hear from you. Fill out the form below and I&apos;ll get back to
              you within one business day.
            </p>
          </header>

          {/* Booking CTA Banner */}
          <div className="mb-12 p-6 md:p-8 rounded-2xl border border-[#242424] bg-[#141414]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mb-2">
                  Prefer to talk first?
                </h2>
                <p className="text-sm text-[#8a8a8a] leading-relaxed max-w-xl">
                  Book a free 30-minute discovery call. We&apos;ll discuss your
                  project needs, timeline, and how I can help — no pressure, no
                  sales pitch.
                </p>
              </div>
              <BookingTrigger
                source="contact"
                className="cursor-pointer"
              >
                Book a Free 30-Minute Call
              </BookingTrigger>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Contact Methods */}
            <div className="lg:col-span-4 space-y-8">
              <section>
                <h3 className="font-display text-lg font-semibold text-[#fafafa] tracking-tight mb-4">
                  Direct Contact
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@yourname.dev"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors shrink-0">
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
                    <span className="truncate">hello@yourname.dev</span>
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors shrink-0">
                      <PhoneIcon />
                    </span>
                    <span>+91 98765 43210</span>
                  </a>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors shrink-0">
                      <WhatsAppIcon width={16} height={16} />
                    </span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </section>

              <section className="pt-6 border-t border-[#242424]">
                <h3 className="font-display text-lg font-semibold text-[#fafafa] tracking-tight mb-4">
                  Availability
                </h3>
                <div className="flex items-center gap-2.5 text-sm text-[#a3a3a3] mb-2">
                  <span
                    className="relative flex h-1.5 w-1.5"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                  </span>
                  {site.responseTime}.
                </div>
                <p className="text-sm text-[#8a8a8a]">{locationLabel}</p>
              </section>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-8">
              <div className="p-6 md:p-8 rounded-2xl border border-[#242424] bg-[#0a0a0a]">
                <h2 className="font-display text-xl font-semibold text-[#fafafa] tracking-tight mb-1">
                  Send a Message
                </h2>
                <p className="text-sm text-[#8a8a8a] mb-6">
                  Tell me about your project and I&apos;ll get back to you
                  within one business day.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
