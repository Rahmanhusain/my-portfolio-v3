'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { faqs } from '@/lib/data/faqs';

export default function FaqHome() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, {
    targets: '.faq-item',
    y: 30,
    stagger: 0.12,
    duration: 0.8,
    start: 'top 82%',
  });

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked"
          description="Answers to the things clients ask before we start. Still unsure? Drop me a message."
          centered={false}
        />

        <div className="border-t border-[#242424]">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="faq-item group border-b border-[#242424]"
            >
              <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none text-[#fafafa]">
                <span className="font-display text-lg font-medium tracking-tight">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl text-[#8a8a8a] transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-[#8a8a8a] leading-relaxed pb-6 max-w-2xl">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
