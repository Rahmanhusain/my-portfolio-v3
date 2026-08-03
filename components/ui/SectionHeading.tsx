'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import clsx from 'clsx';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  /** Wire this to the parent section's `aria-labelledby` so the landmark
   *  actually resolves to a name (it silently didn't before). */
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  id,
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
        <p
          className={clsx(
            'flex items-center gap-2.5 text-xs font-medium tracking-widest uppercase text-muted mb-4',
            centered && 'justify-center'
          )}
        >
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gradient-to-r from-faint to-transparent"
          />
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-display text-4xl md:text-5xl font-semibold text-fg leading-tight tracking-tight"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
