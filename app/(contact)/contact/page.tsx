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
          <header className="mb-20 max-w-2xl">
            <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-[#fafafa] tracking-tight leading-tight mb-6">
              Let&apos;s work together.
            </h1>
            <p className="text-[#8a8a8a] leading-relaxed text-lg">
              Have a project in mind or just want to say hello? I&apos;d love to
              hear from you. Choose the best way to reach me below.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Column - Contact Methods */}
            <div className="space-y-12">
              {/* Book a Call Section */}
              <section>
                <h2 className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mb-4">
                  Book a Call
                </h2>
                <p className="text-[#8a8a8a] mb-6 leading-relaxed">
                  Prefer to talk through your project? Schedule a free 30-minute
                  discovery call where we can discuss your needs and how I can
                  help.
                </p>
                <BookingTrigger
                  source="contact"
                  className="text-[11px] md:text-sm px-5 py-2.5 bg-white/10 hover:bg-white cursor-pointer"
                >
                  Book a Free 30-Minute Call
                </BookingTrigger>
              </section>

              {/* Direct Contact Section */}
              <section>
                <h2 className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mb-4">
                  Direct Contact
                </h2>
                <p className="text-[#8a8a8a] mb-6 leading-relaxed">
                  Prefer email or want to share more details upfront? Use any of
                  these channels to reach me directly.
                </p>

                <div className="space-y-4">
                  <a
                    href="mailto:hello@yourname.dev"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-xl border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                      <svg
                        width="18"
                        height="18"
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
                    <span>
                      <span className="text-[#fafafa]">Email:</span>{" "}
                      hello@yourname.dev
                    </span>
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-xl border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                      <PhoneIcon />
                    </span>
                    <span>
                      <span className="text-[#fafafa]">Phone:</span> +91 98765
                      43210
                    </span>
                  </a>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-xl border border-[#242424] flex items-center justify-center group-hover:border-[#3a3a3a] transition-colors">
                      <WhatsAppIcon width={19} height={19} />
                    </span>
                    <span>
                      <span className="text-[#fafafa]">WhatsApp:</span> +91
                      98765 43210
                    </span>
                  </a>
                </div>
              </section>

              {/* Availability & Location */}
              <section className="pt-8 border-t border-[#242424]">
                <div className="flex items-center gap-2.5 text-sm text-[#a3a3a3] mb-4">
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
            <div className="lg:border-l lg:border-[#242424] lg:pl-10">
              <h2 className="font-display text-2xl font-semibold text-[#fafafa] tracking-tight mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
