"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const stats = [
  { value: "4+", label: "Years experience" },
  { value: "30+", label: "Projects shipped" },
  { value: "15+", label: "Happy clients" },
];

const IMG_SHADOW_REST =
  "0 10px 30px rgba(0,0,0,0.28), 0 0 0 1px rgba(250,250,250,0.04)";
const IMG_SHADOW_HOVER =
  "0 28px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,250,250,0.1)";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgScrollRef = useRef<HTMLDivElement>(null);
  const imgHoverRef = useRef<HTMLDivElement>(null);
  const imgPhotoRef = useRef<HTMLDivElement>(null);
  const hoverTweenRef = useRef<gsap.core.Timeline | null>(null);
  const moveTweensRef = useRef<{
    rotateX: (value: number) => void;
    rotateY: (value: number) => void;
    x: (value: number) => void;
    y: (value: number) => void;
    scale: (value: number) => void;
    photoX: (value: number) => void;
    photoY: (value: number) => void;
    photoScale: (value: number) => void;
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

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const imgEl = imgScrollRef.current;
      if (!imgEl) return;

      if (prefersReducedMotion) {
        gsap.set(imgEl, { clearProps: "all", opacity: 1 });
        return;
      }

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
          },
          transformOrigin: "center center",
        },
      );
    },
    { scope: sectionRef },
  );

  const handleImgEnter = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = imgHoverRef.current;
    const photo = imgPhotoRef.current;
    if (prefersReducedMotion || !card || !photo) return;

    if (!moveTweensRef.current) {
      moveTweensRef.current = {
        rotateX: gsap.quickTo(card, "rotateX", {
          duration: 0.28,
          ease: "power3.out",
        }),
        rotateY: gsap.quickTo(card, "rotateY", {
          duration: 0.28,
          ease: "power3.out",
        }),
        x: gsap.quickTo(card, "x", { duration: 0.28, ease: "power3.out" }),
        y: gsap.quickTo(card, "y", { duration: 0.28, ease: "power3.out" }),
        scale: gsap.quickTo(card, "scale", {
          duration: 0.28,
          ease: "power3.out",
        }),
        photoX: gsap.quickTo(photo, "x", { duration: 0.3, ease: "power3.out" }),
        photoY: gsap.quickTo(photo, "y", { duration: 0.3, ease: "power3.out" }),
        photoScale: gsap.quickTo(photo, "scale", {
          duration: 0.3,
          ease: "power3.out",
        }),
      };
    }

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap
      .timeline()
      .to(
        card,
        {
          rotateX: -6,
          rotateY: 10,
          scale: 1.04,
          boxShadow: IMG_SHADOW_HOVER,
          duration: 0.45,
          ease: "power2.out",
        },
        0,
      )
      .to(
        photo,
        {
          filter: "grayscale(0%) brightness(1.08) saturate(1.05)",
          scale: 1.06,
          duration: 0.45,
          ease: "power2.out",
        },
        0,
      );

    moveTweensRef.current.rotateX(-7);
    moveTweensRef.current.rotateY(9);
    moveTweensRef.current.x(0);
    moveTweensRef.current.y(0);
    moveTweensRef.current.scale(1.045);
    moveTweensRef.current.photoX(0);
    moveTweensRef.current.photoY(0);
    moveTweensRef.current.photoScale(1.06);
  }, []);

  const handleImgMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const card = imgHoverRef.current;
      const photo = imgPhotoRef.current;
      const moveTweens = moveTweensRef.current;
      if (prefersReducedMotion || !card || !moveTweens) return;

      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      moveTweens.rotateY(offsetX * 16);
      moveTweens.rotateX(offsetY * -15);
      moveTweens.x(offsetX * 8);
      moveTweens.y(offsetY * 8);
      moveTweens.photoX(offsetX * -10);
      moveTweens.photoY(offsetY * -10);

      if (photo) {
        gsap.to(photo, {
          filter: "grayscale(0%) brightness(1.1) saturate(1.08)",
          duration: 0.18,
          ease: "power2.out",
        });
      }
    },
    [],
  );

  const handleImgLeave = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = imgHoverRef.current;
    const photo = imgPhotoRef.current;
    const moveTweens = moveTweensRef.current;
    if (prefersReducedMotion || !card || !photo || !moveTweens) return;

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap
      .timeline()
      .to(
        card,
        {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: IMG_SHADOW_REST,
          duration: 0.65,
          ease: "elastic.out(1, 0.55)",
        },
        0,
      )
      .to(
        photo,
        {
          filter: "grayscale(100%) brightness(1)",
          scale: 1.02,
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        0,
      );

    moveTweens.rotateX(0);
    moveTweens.rotateY(0);
    moveTweens.x(0);
    moveTweens.y(0);
    moveTweens.scale(1);
    moveTweens.photoX(0);
    moveTweens.photoY(0);
    moveTweens.photoScale(1.02);
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
                className="relative aspect-3/4 w-full rounded-2xl overflow-hidden border border-border bg-surface shrink-0 cursor-pointer touch-none"
                style={{
                  boxShadow: IMG_SHADOW_REST,
                  transformStyle: "preserve-3d",
                  willChange: "transform, box-shadow",
                }}
                onMouseEnter={handleImgEnter}
                onMouseLeave={handleImgLeave}
                onMouseMove={handleImgMove}
                onPointerEnter={handleImgEnter}
                onPointerLeave={handleImgLeave}
                onPointerMove={handleImgMove}
                tabIndex={0}
                onFocus={handleImgEnter}
                onBlur={handleImgLeave}
              >
                <div
                  ref={imgPhotoRef}
                  className="absolute inset-0 grayscale"
                  style={{ transform: "translateZ(0) scale(1.02)" }}
                >
                  <Image
                    src="/rahman.jpeg"
                    alt="Rahman — Full-Stack Developer"
                    fill
                    className="object-cover object-[28%_center]"
                    sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, (max-width: 1024px) 352px, 384px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="About Me"
              title="I turn ideas into shipping products."
            />

            <div ref={bioRef} className="space-y-4 text-muted leading-relaxed">
              <p className="about-bio-line">
                I&apos;m a Full-Stack Developer based in Delhi, specializing in
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

            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-border"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <p className="font-display text-3xl font-bold text-fg tracking-tight">
                    {stat.value}
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
