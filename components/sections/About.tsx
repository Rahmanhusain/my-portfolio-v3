"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const stats = [
  { value: 100, suffix: "%", label: "On-time delivery" },
  { value: 8, suffix: "", label: "Services offered" },
  { value: 10, suffix: "+", label: "Happy clients" },
];

/** Things a client can scan in a second — cheaper to read than the bio. */
const capabilities = [
  "Next.js & React",
  "TypeScript",
  "Node & APIs",
  "UI/UX Design",
  "Automation & AI",
  "Cloud & DevOps",
];

const IMG_SHADOW_REST =
  "0 10px 30px rgba(23,21,15,0.10), 0 0 0 1px rgba(23,21,15,0.06)";
const IMG_SHADOW_HOVER =
  "0 28px 56px rgba(23,21,15,0.20), 0 0 0 1px rgba(23,21,15,0.12)";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgScrollRef = useRef<HTMLDivElement>(null);
  const imgHoverRef = useRef<HTMLDivElement>(null);
  const imgPhotoRef = useRef<HTMLDivElement>(null);
  const hoverEnabledRef = useRef(false);
  const hoverMoveRef = useRef<{
    cardX: (value: number) => void;
    cardY: (value: number) => void;
    photoX: (value: number) => void;
    photoY: (value: number) => void;
  } | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef, {
    targets: ".about-bio-line",
    trigger: bioRef,
    y: 24,
    stagger: 0.14,
    duration: 0.75,
    start: "top 82%",
  });

  useScrollReveal(sectionRef, {
    targets: ".about-stat",
    trigger: statsRef,
    y: 30,
    stagger: 0.12,
    duration: 0.7,
    start: "top 85%",
  });

  // Count-up on the stat numbers. The rendered HTML already contains the final
  // value, so crawlers and reduced-motion users read the real number — the
  // animation only ever rewrites it on the way up.
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      gsap.utils.toArray<HTMLElement>(".about-stat-value").forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const suffix = el.dataset.suffix ?? "";
        const counter = { n: 0 };

        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.n)}${suffix}`;
          },
        });
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const imgEl = imgScrollRef.current;
      if (!imgEl) return;

      if (prefersReducedMotion) {
        hoverEnabledRef.current = true;
        gsap.set(imgEl, { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set([imgHoverRef.current, imgPhotoRef.current], { force3D: true });

      gsap.fromTo(
        imgEl,
        {
          scale: 0.5,
          rotateY: -90,
          opacity: 0.35,
        },
        {
          scale: 1,
          rotateY: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imgEl,
            start: "top 85%",
            end: "top center",
            scrub: 0.45,
            onUpdate: (self) => {
              hoverEnabledRef.current = self.progress >= 0.995;
            },
          },
          transformOrigin: "center center",
        },
      );
    },
    { scope: sectionRef },
  );

  const handleImgEnter = useCallback(() => {
    if (!hoverEnabledRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = imgHoverRef.current;
    const photo = imgPhotoRef.current;
    if (prefersReducedMotion || !card || !photo) return;

    if (!hoverMoveRef.current) {
      hoverMoveRef.current = {
        cardX: gsap.quickTo(card, "x", { duration: 0.3, ease: "power2.out" }),
        cardY: gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" }),
        photoX: gsap.quickTo(photo, "x", { duration: 0.3, ease: "power2.out" }),
        photoY: gsap.quickTo(photo, "y", { duration: 0.3, ease: "power2.out" }),
      };
    }

    gsap.to(card, {
      boxShadow: IMG_SHADOW_HOVER,
      scale: 1.015,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(photo, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleImgMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hoverEnabledRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const card = imgHoverRef.current;
      const photo = imgPhotoRef.current;
      const hoverMove = hoverMoveRef.current;
      if (prefersReducedMotion || !card || !hoverMove) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      hoverMove.cardX(x * 0.16);
      hoverMove.cardY(y * 0.16);

      if (photo) {
        hoverMove.photoX(x * -0.045);
        hoverMove.photoY(y * -0.045);
      }
    },
    [],
  );

  const handleImgLeave = useCallback(() => {
    if (!hoverEnabledRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = imgHoverRef.current;
    const photo = imgPhotoRef.current;
    if (prefersReducedMotion || !card || !photo) return;

    gsap.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      boxShadow: IMG_SHADOW_REST,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });

    gsap.to(photo, {
      x: 0,
      y: 0,
      scale: 1.08,
      duration: 0.45,
      ease: "power2.out",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 md:py-40 border-t border-border"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">
          <div className="about-img-perspective order-last md:order-first flex justify-center md:justify-center w-full min-w-0">
            <div
              ref={imgScrollRef}
              className="about-img-flip w-full max-w-[min(100%,18.5rem)] sm:max-w-[min(100%,19.5rem)] md:max-w-[min(100%,21.5rem)] lg:max-w-[min(100%,23.5rem)]"
            >
              <div
                ref={imgHoverRef}
                className="relative aspect-[3/4.1] w-full rounded-2xl overflow-hidden border border-border bg-surface shrink-0 cursor-pointer touch-none"
                style={{
                  boxShadow: IMG_SHADOW_REST,
                  transformStyle: "preserve-3d",
                  willChange: "transform, box-shadow",
                }}
                onPointerEnter={handleImgEnter}
                onPointerLeave={handleImgLeave}
                onPointerMove={handleImgMove}
                tabIndex={0}
                onFocus={handleImgEnter}
                onBlur={handleImgLeave}
              >
                <div
                  ref={imgPhotoRef}
                  className="absolute inset-0"
                  style={{
                    transform: "translateZ(0) scale(1.12)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src="/rahman.jpeg"
                    alt="Rahman — Software Developer"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 352px, 384px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              id="about-heading"
              eyebrow="About Me"
              title="I turn ideas into shipping products."
            />

            <div ref={bioRef} className="space-y-4 text-muted leading-relaxed">
              <p className="about-bio-line">
                I&apos;m a Software Developer based in Delhi, specializing in
                building fast, accessible, and beautifully crafted web
                experiences. I work across the entire stack — from designing
                pixel-perfect interfaces to architecting scalable backend
                systems.
              </p>
              <p className="about-bio-line">
                I care deeply about performance, clean code, and the details
                that make a product feel genuinely great to use. Whether
                it&apos;s a startup&apos;s MVP or a production-grade platform, I
                bring the same level of craft to every project.
              </p>
              <p className="about-bio-line">
                When I&apos;m not building, I&apos;m writing about web
                development, contributing to open source, or exploring the
                intersection of design and engineering.
              </p>
            </div>

            {/* Capability chips — skimmable proof of range */}
            <ul className="flex flex-wrap gap-2 mt-8">
              {capabilities.map((cap) => (
                <li
                  key={cap}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-faint hover:text-fg"
                >
                  {cap}
                </li>
              ))}
            </ul>

            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <p
                    className="about-stat-value font-display text-3xl font-bold text-fg tracking-tight tabular-nums"
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                  >
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-muted mt-1 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
