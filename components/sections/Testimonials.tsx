'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { testimonials } from '@/lib/data/testimonials';

export default function Testimonials() {
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
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Kind Words"
          title="What Clients Say"
          description="I've been lucky to work with some great people."
          centered={false}
        />

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
