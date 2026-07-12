import { faqs } from '@/lib/data/faqs';

export default function Faq() {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section
        id="faq"
        className="py-32 md:py-40 border-t border-[#242424]"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-6xl mx-auto px-6">
          <header className="mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
              Questions
            </p>
            <h2
              id="faq-heading"
              className="font-display text-4xl md:text-5xl font-semibold text-[#fafafa] tracking-tight leading-tight"
            >
              Frequently asked
            </h2>
            <p className="text-[#8a8a8a] mt-4 leading-relaxed max-w-lg">
              Answers to the things clients ask before we start. Still unsure?
              Drop me a message.
            </p>
          </header>

          <div className="border-t border-[#242424]">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-[#242424]"
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
    </>
  );
}
