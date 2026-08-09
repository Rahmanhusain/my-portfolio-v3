'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import ServiceList from '@/components/ui/ServiceList';
import type { Service } from '@/lib/types/content';

export default function Services({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, {
    targets: '.services-list > li',
    y: 24,
    stagger: 0.08,
    duration: 0.6,
    start: 'top 82%',
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-20 sm:py-24 border-t border-border"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeading
            id="services-heading"
            eyebrow="What I Do"
            title="Services"
            description="End-to-end development across the full stack, with a focus on performance and craft."
          />
          <MagneticButton
            as="a"
            href="/services"
            className="shrink-0 self-start md:self-auto sm:mb-2"
          >
            See All Services ↗
          </MagneticButton>
        </div>

        <ServiceList services={services} className="services-list" />
      </div>
    </section>
  );
}
