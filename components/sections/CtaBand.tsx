import Link from 'next/link';
import BookingTrigger from '@/components/ui/BookingTrigger';
import { site, whatsappHref } from '@/lib/site';

interface CtaBandProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Identifies which page fired the booking modal, for lead attribution. */
  source: string;
}

/**
 * The site's closing argument. Dropped at the bottom of every server-rendered
 * route so a visitor who reads to the end always has the booking CTA in front
 * of them instead of a dead end.
 *
 * Server Component — the only client code is <BookingTrigger>, which is an
 * existing island.
 */
export default function CtaBand({
  eyebrow = 'Next step',
  title = "Let's turn your idea into something shipped.",
  description = 'A free 30-minute call. We scope the work, talk timelines and budget, and you leave with a clear plan — whether or not you hire me.',
  source,
}: CtaBandProps) {
  return (
    <section
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
      aria-labelledby="cta-band-heading"
    >
      <div className="aurora" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="reveal mb-4 text-xs font-medium uppercase tracking-widest text-muted">
          {eyebrow}
        </p>

        <h2
          id="cta-band-heading"
          className="reveal font-display text-3xl font-semibold leading-tight tracking-tight text-fg md:text-5xl"
        >
          {title}
        </h2>

        <p className="reveal mx-auto mt-5 max-w-xl leading-relaxed text-muted">
          {description}
        </p>

        <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3">
          <BookingTrigger
            source={source}
            variant="solid"
            className="cta-halo cursor-pointer px-7 py-3.5"
          >
            Book a Free 30-Minute Call
          </BookingTrigger>

          <Link
            href="/contact"
            className="hover-lift inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg hover:bg-fg hover:text-bg"
          >
            Get in Touch
          </Link>
        </div>

        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
          <span>{site.responseTime}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-black/10 sm:block" />
          <span>No obligation, no sales pitch</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-black/10 sm:block" />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="link-sweep text-fg"
          >
            Or message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
