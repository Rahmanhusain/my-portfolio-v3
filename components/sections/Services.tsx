'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import { services } from '@/lib/data/services';

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, {
    targets: '.service-card',
    y: 30,
    stagger: 0.15,
    duration: 0.7,
    start: 'top 82%',
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="What I Do"
            title="Services"
            description="End-to-end development across the full stack, with a focus on performance and craft."
          />
          <MagneticButton
            as="a"
            href="/services"
            className="shrink-0 self-start md:self-auto mb-2"
          >
            See All Services ↗
          </MagneticButton>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-px bg-[#242424] border border-[#242424] rounded-2xl overflow-hidden">
          {services.map((service) => (
            <article
              key={service.number}
              className="service-card p-8 bg-[#0a0a0a] hover:bg-[#141414] transition-colors duration-300 group flex flex-col"
            >
              <p className="font-display text-xs font-medium text-[#242424] group-hover:text-[#3a3a3a] mb-4 transition-colors duration-300 tracking-wider">
                {service.number}
              </p>
              <h3 className="font-display text-xl font-semibold text-[#fafafa] mb-3 leading-tight tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-[#8a8a8a] leading-relaxed flex-1">
                {service.shortDesc}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="w-6 h-px bg-[#242424] group-hover:w-12 group-hover:bg-[#fafafa] transition-all duration-300" />
                <Link
                  href={`/services/${service.slug}`}
                  className="text-[11px] font-semibold uppercase tracking-wide text-[#8a8a8a] group-hover:text-[#fafafa] transition-colors duration-200"
                  aria-label={`Read more about ${service.title}`}
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
