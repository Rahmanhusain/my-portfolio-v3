"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import RotatingFloatingCards from "../ui/RoatatingFloatingCards";
import BookingTrigger from "@/components/ui/BookingTrigger";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameLeftRef = useRef<HTMLDivElement>(null);
  const nameRightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const heroNameSize = "clamp(2.6rem, min(8vw, 12vh), 8rem)";

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      tl.fromTo(
        nameLeftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.0 },
        0,
      )
        .fromTo(
          nameRightRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1.0 },
          0,
        )
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75 },
          0.35,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.5,
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col min-h-svh overflow-hidden bg-[#0a0a0a] pt-14"
      aria-labelledby="hero-heading"
    >
      {/* ── Decorative layers (must be absolute — purely visual) ──────── */}

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(255,255,255,0.028) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Cursive watermark — sits behind everything */}
      {/* <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-cursive), Georgia, serif',
            fontSize: 'clamp(2rem, 5.5vw, 5rem)',
            color: 'rgba(250,250,250,0.05)',
            whiteSpace: 'nowrap',
            fontStyle: 'italic',
          }}
        >
          Software Engineer
        </span>
      </div> */}

      {/* ── Main content — max-w-6xl container, matches all other sections ── */}
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col flex-1">
        {/* Cards — vertically centred, takes remaining space */}
        <div className="flex flex-1 items-center justify-center py-5">
          <div className="cards-responsive">
            <RotatingFloatingCards />
          </div>
        </div>

        {/* Names row — Rahman left, Builds. right */}
        <div className="flex items-end justify-between pb-1">
          <div ref={nameLeftRef}>
            <h1
              id="hero-heading"
              className="font-display font-bold text-[#fafafa] leading-none"
              style={{
                fontSize: heroNameSize,
                letterSpacing: "-0.04em",
              }}
            >
              Rahman
            </h1>
          </div>

          <div ref={nameRightRef} className="text-right">
            <p
              className="font-display font-bold leading-none"
              style={{
                fontSize: heroNameSize,
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(250,250,250,0.2)",
              }}
              aria-hidden="true"
            >
              Builds.
            </p>
          </div>
        </div>

        {/* Bottom strip — descriptor + CTAs + scroll cue */}
        <div className="flex flex-col items-center gap-3.5 py-6 md:py-8">
          <div ref={labelRef}>
            <p className="text-center text-[#8a8a8a] text-[11px] md:text-sm leading-relaxed max-w-[280px] md:max-w-md">
              Software Developer crafting fast, accessible, and beautifully
              designed web products — from pixel-perfect UIs to scalable APIs.
            </p>
          </div>

          <div
            ref={ctaRef}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton
              as="a"
              href="/#contact"
              className="text-[11px] md:text-sm px-5 py-2.5"
            >
              Get in Touch
            </MagneticButton>
            <BookingTrigger
              source="hero"
              className="text-[11px] md:text-sm px-5 py-2.5 bg-white/10 hover:bg-white cursor-pointer"
            >
              Book a Call
            </BookingTrigger>
          </div>

          {/* Scroll cue */}
          <div
            className="flex flex-col items-center gap-1 opacity-20"
            aria-hidden="true"
          >
            <div className="w-px h-5 bg-[#fafafa]" />
            <span className="text-[9px] tracking-[0.18em] uppercase text-[#fafafa]">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}