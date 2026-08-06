'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import SectionHeading from '@/components/ui/SectionHeading';
import BookingTrigger from '@/components/ui/BookingTrigger';
import ContactForm from '@/components/ui/ContactForm';
import { site, locationLabel, mailto, whatsappHref } from '@/lib/site';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from('.contact-inner', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 sm:py-24 md:py-40 border-t border-border"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="contact-inner grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          {/* Left — pitch + direct contact */}
          <div>
            <SectionHeading
              id="contact-heading"
              eyebrow="Get in Touch"
              title="Let's work together."
              description="Have a project in mind or just want to say hello? I'd love to hear from you."
            />

            <div className="space-y-3.5">
              <a
                href={mailto}
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors text-sm group"
              >
                <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center group-hover:border-faint transition-colors shrink-0">
                  <svg width="15" height="15" fill="none" viewBox="0 0 14 14" aria-hidden="true">
                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="link-sweep">{site.social.email}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors text-sm group"
              >
                <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center group-hover:border-faint transition-colors shrink-0">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <span className="link-sweep">WhatsApp — usually fastest</span>
              </a>
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors text-sm group"
              >
                <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center group-hover:border-faint transition-colors shrink-0">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </span>
                {site.social.github.replace(/^https?:\/\//, '')}
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-fg transition-colors text-sm group"
              >
                <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center group-hover:border-faint transition-colors shrink-0">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </span>
                {site.social.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>

            {/* Response-time promise + location — removes friction before booking */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-strong">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                {site.responseTime}.
              </div>
              <p className="text-sm text-muted">{locationLabel}</p>
            </div>

            {/* Book a call CTA — match the page's outline button language */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-xs font-medium tracking-widest uppercase text-muted mb-3">
                Prefer to talk?
              </p>
              <BookingTrigger source="contact-section">
                Book a Free 30-Minute Call
              </BookingTrigger>
            </div>
          </div>

          {/* Right — shared form (currency-aware budget, etc.) */}
          <div className="md:sticky md:top-24 md:self-start">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
