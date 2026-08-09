'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import TestimonialCarousel from '@/components/ui/TestimonialCarousel';
import type { Testimonial } from '@/lib/types/content';

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, {
    targets: '.testimonial-card',
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    start: 'top 82%',
  });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-20 sm:py-24 md:py-40 border-t border-border"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Kind Words"
          title="What Clients Say"
          description="I've been lucky to work with some great people."
          centered={false}
        />

        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
