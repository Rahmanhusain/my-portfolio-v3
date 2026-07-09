import type { Testimonial } from '@/lib/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="testimonial-card border border-[#242424] rounded-2xl p-8 bg-[#141414] flex flex-col gap-6">
      {/* Quote mark */}
      <svg
        width="32"
        height="24"
        viewBox="0 0 32 24"
        fill="none"
        aria-hidden="true"
        className="text-[#242424] shrink-0"
      >
        <path
          d="M0 24V14.4C0 10.4 0.96 7.2 2.88 4.8C4.8 2.4 7.36 0.96 10.56 0.48L11.52 2.88C9.44 3.52 7.84 4.64 6.72 6.24C5.6 7.84 5.04 9.6 5.04 11.52H10.08V24H0ZM17.92 24V14.4C17.92 10.4 18.88 7.2 20.8 4.8C22.72 2.4 25.28 0.96 28.48 0.48L29.44 2.88C27.36 3.52 25.76 4.64 24.64 6.24C23.52 7.84 22.96 9.6 22.96 11.52H28V24H17.92Z"
          fill="currentColor"
        />
      </svg>

      <blockquote className="flex-1">
        <p className="text-[#fafafa] leading-relaxed text-sm md:text-base">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      <footer className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-[#242424] border border-[#3a3a3a] flex items-center justify-center text-xs font-semibold text-[#fafafa] shrink-0"
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-medium text-[#fafafa]">{testimonial.name}</p>
          <p className="text-xs text-[#8a8a8a]">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </footer>
    </article>
  );
}
