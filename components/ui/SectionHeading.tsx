'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import clsx from 'clsx';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as Element[];
    if (!children.length) return;

    if (prefersReducedMotion) {
      gsap.set(children, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            // Removed invalidateOnRefresh and per-instance refresh —
            // the global refresh in SmoothScrollProvider handles this once.
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={clsx('mb-16', centered && 'text-center')}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-[#fafafa] leading-tight tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[#8a8a8a] max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
