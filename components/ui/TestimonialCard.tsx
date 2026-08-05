import type { Testimonial } from '@/lib/data/testimonials';
import clsx from 'clsx';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/** Deterministic avatar tint per person, so the row has some colour variety
 *  without a random value that would differ between server and client. */
const AVATAR_TINTS = [
  'from-[#dfe3f2] to-[#eef0f8]',
  'from-[#efe0ee] to-[#f8eef7]',
  'from-[#dbeee2] to-[#edf7f1]',
];

function tintFor(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

export default function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  const attribution = [testimonial.role, testimonial.company]
    .filter(Boolean)
    .join(', ');

  return (
    <article
      className={clsx(
        'testimonial-card glow-card relative flex h-full flex-col overflow-hidden rounded-2xl',
        'border border-border bg-raised p-8 pt-9',
        className
      )}
    >
      {/* Watermark quote mark — decorative, sits behind the text */}
      <svg
        viewBox="0 0 32 24"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-2 right-2 h-12 w-12 text-faint opacity-40"
      >
        <path
          d="M0 24V14.4C0 10.4 0.96 7.2 2.88 4.8C4.8 2.4 7.36 0.96 10.56 0.48L11.52 2.88C9.44 3.52 7.84 4.64 6.72 6.24C5.6 7.84 5.04 9.6 5.04 11.52H10.08V24H0ZM17.92 24V14.4C17.92 10.4 18.88 7.2 20.8 4.8C22.72 2.4 25.28 0.96 28.48 0.48L29.44 2.88C27.36 3.52 25.76 4.64 24.64 6.24C23.52 7.84 22.96 9.6 22.96 11.52H28V24H17.92Z"
          fill="currentColor"
        />
      </svg>

      <blockquote className="relative flex-1">
        <p className="font-display text-base leading-relaxed tracking-tight text-strong md:text-lg">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      <footer className="mt-7 flex items-center gap-3.5 border-t border-border pt-6">
        {/* Avatar — initials on a tinted plate */}
        <div
          className={clsx(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            'border border-faint bg-gradient-to-br text-xs font-semibold text-strong',
            tintFor(testimonial.id)
          )}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-fg">
            {testimonial.name}
          </p>
          {attribution && (
            <p className="truncate text-xs text-subtle">{attribution}</p>
          )}
        </div>
      </footer>
    </article>
  );
}
