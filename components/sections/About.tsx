'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/useScrollReveal';
import { gsap } from '@/lib/gsap';
import { useEffect } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';

const stats = [
  { value: '4+', label: 'Years experience' },
  { value: '30+', label: 'Projects shipped' },
  { value: '15+', label: 'Happy clients' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  // Bio text reveal
  useScrollReveal(sectionRef, {
    targets: bioRef,
    trigger: bioRef,
    y: 40,
    duration: 0.9,
    start: 'top 82%',
  });

  // Stats stagger
  useScrollReveal(sectionRef, {
    targets: '.about-stat',
    trigger: statsRef,
    y: 30,
    stagger: 0.12,
    duration: 0.7,
    start: 'top 85%',
  });

  // Image parallax — separate effect, no opacity change
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Image */}
          <div
            ref={imgRef}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#242424] bg-[#141414] order-last md:order-first"
          >
            {/* Placeholder gradient — replace with next/image once photo is available */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              <span className="text-[#242424] text-sm tracking-widest uppercase">
                Photo
              </span>
            </div>
            {/*
              Once you have a photo, replace the div above with:
              <Image
                src="/about-photo.jpg"
                alt="Rahman — Full-Stack Developer"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            */}
          </div>

          {/* Text */}
          <div>
            <SectionHeading
              eyebrow="About Me"
              title="I turn ideas into shipping products."
            />

            <div ref={bioRef} className="space-y-4 text-[#8a8a8a] leading-relaxed">
              <p>
                I&apos;m a Full-Stack Developer based in Delhi, specializing in building
                fast, accessible, and beautifully crafted web experiences. I work across
                the entire stack — from designing pixel-perfect interfaces to architecting
                scalable backend systems.
              </p>
              <p>
                I care deeply about performance, clean code, and the details that make a
                product feel genuinely great to use. Whether it&apos;s a startup&apos;s MVP or
                a production-grade platform, I bring the same level of craft to every
                project.
              </p>
              <p>
                When I&apos;m not building, I&apos;m writing about web development, contributing to
                open source, or exploring the intersection of design and engineering.
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-[#242424]">
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <p className="font-display text-3xl font-bold text-[#fafafa] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#8a8a8a] mt-1 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
