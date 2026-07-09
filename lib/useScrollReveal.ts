'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type MaybeRef<T> = React.RefObject<T | null> | T | null | undefined;

interface ScrollRevealOptions {
  targets: string | MaybeRef<Element>;
  trigger?: MaybeRef<Element>;
  y?: number;
  scale?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  delay?: number;
}

function resolveRef<T>(value: MaybeRef<T>): T | null {
  if (!value) return null;
  if (typeof value === 'object' && 'current' in (value as object)) {
    return (value as React.RefObject<T | null>).current;
  }
  return value as T;
}

export function useScrollReveal(
  containerRef: React.RefObject<Element | null>,
  options: ScrollRevealOptions
) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const container = containerRef.current;
    if (!container) return;

    // Resolve targets
    let els: Element[] = [];
    if (typeof options.targets === 'string') {
      els = Array.from(container.querySelectorAll(options.targets));
    } else {
      const el = resolveRef(options.targets as MaybeRef<Element>);
      if (el) els = [el];
    }

    if (!els.length) return;

    if (prefersReducedMotion) {
      gsap.set(els, { clearProps: 'all' });
      return;
    }

    const triggerEl =
      resolveRef(options.trigger as MaybeRef<Element> | undefined) ?? els[0];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        {
          opacity: 0,
          y: options.y ?? 40,
          ...(options.scale !== undefined && { scale: options.scale }),
        },
        {
          opacity: 1,
          y: 0,
          ...(options.scale !== undefined && { scale: 1 }),
          duration: options.duration ?? 0.8,
          delay: options.delay ?? 0,
          stagger: options.stagger ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: triggerEl,
            start: options.start ?? 'top 85%',
            // No invalidateOnRefresh — the global refresh in
            // SmoothScrollProvider handles recalculation once, cleanly.
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
