"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import RotatingFloatingCards from "../ui/RoatatingFloatingCards";
import BookingTrigger from "@/components/ui/BookingTrigger";

/** Cycled under the headline — each one is a thing a client actually buys. */
const ROLES = [
  "web apps",
  "custom CRMs",
  "AI automations",
  "e-commerce stores",
  "APIs that scale",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameLeftRef = useRef<HTMLDivElement>(null);
  const nameRightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLSpanElement>(null);
  const heroNameSize = "clamp(2.6rem, min(8vw, 12vh), 8rem)";

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

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

      // Word cycler — swaps the deliverable under the headline so the hero
      // says "I build the specific thing you came here looking for".
      const rolesEl = rolesRef.current;
      if (rolesEl && !prefersReducedMotion) {
        const cycle = gsap.timeline({ repeat: -1, delay: 1.6 });
        ROLES.forEach((_, i) => {
          const next = ROLES[(i + 1) % ROLES.length];
          cycle
            .to(rolesEl, {
              yPercent: -100,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
              delay: 2,
            })
            .call(() => {
              rolesEl.textContent = next;
            })
            .set(rolesEl, { yPercent: 100 })
            .to(rolesEl, {
              yPercent: 0,
              opacity: 1,
              duration: 0.45,
              ease: "power3.out",
            });
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col min-h-svh overflow-hidden bg-bg pt-14"
      aria-labelledby="hero-heading"
    >
      {/* ── Decorative layers (must be absolute — purely visual) ──────── */}

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(23,21,15,0.035) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="grid-bg" aria-hidden="true" />
      <div className="aurora" aria-hidden="true" />

      {/* ── Main content — max-w-6xl container, matches all other sections ── */}
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col flex-1 relative">
        {/* Cards — vertically centred, takes remaining space */}
        <div className="flex flex-1 items-center justify-center py-3">
          <div className="cards-responsive">
            <RotatingFloatingCards />
          </div>
        </div>

        {/* Names row — Rahman left, Builds. right */}
        <div className="flex items-end justify-between pb-1">
          <div ref={nameLeftRef}>
            <h1
              id="hero-heading"
              className="font-display font-bold text-fg leading-none"
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
                WebkitTextStroke: "1.5px rgba(23,21,15,0.22)",
              }}
              aria-hidden="true"
            >
              Builds.
            </p>
          </div>
        </div>

        {/* Bottom strip — descriptor + CTAs + scroll cue */}
        <div className="flex flex-col items-center gap-3.5 py-6 md:py-8">
          <div ref={labelRef} className="flex flex-col items-center gap-2">
            {/* Rotating deliverable — the marquee-style hook */}
            <p className="flex items-center justify-center gap-1.5 text-[13px] md:text-base text-muted">
              <span>I build</span>
              <span className="inline-flex h-[1.4em] overflow-hidden align-bottom">
                <span
                  ref={rolesRef}
                  className="font-display font-semibold text-fg"
                >
                  {ROLES[0]}
                </span>
              </span>
            </p>
            <p className="text-center text-[11px] md:text-sm leading-relaxed text-muted max-w-[280px] md:max-w-md">
              Software Developer crafting fast, accessible, and beautifully
              designed web products — from pixel-perfect UIs to scalable APIs.
            </p>
          </div>

          <div
            ref={ctaRef}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {/* Primary — the action worth the most to a visitor and to me */}
            <BookingTrigger
              source="hero"
              variant="solid"
              className="cta-halo cursor-pointer text-[11px] md:text-sm px-6 py-3"
            >
              Book a Free Call
            </BookingTrigger>
            <MagneticButton
              as="a"
              href="/#contact"
              className="text-[11px] md:text-sm px-5 py-2.5"
            >
              Get in Touch
            </MagneticButton>
          </div>

          <p className="text-[10px] md:text-[11px] text-subtle">
            30 minutes · No obligation · No sales pitch
          </p>

          {/* Scroll cue */}
          <div
            className="flex flex-col items-center gap-1 opacity-20"
            aria-hidden="true"
          >
            <div className="w-px h-5 bg-fg" />
            <span className="text-[9px] tracking-[0.18em] uppercase text-fg">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
