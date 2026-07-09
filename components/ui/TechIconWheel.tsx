'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { techStack } from '@/lib/data/techStack';

interface TechIconWheelProps {
  size?: number;
  iconSize?: number;
}

export default function TechIconWheel({
  size = 340,
  iconSize = 44,
}: TechIconWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = size / 2 - iconSize / 2 - 4;

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      // Continuous wheel rotation
      gsap.to(wheelRef.current, {
        rotate: 360,
        duration: 28,
        repeat: -1,
        ease: 'none',
      });

      // Counter-rotate icons so they stay upright
      gsap.to('.wheel-icon-img', {
        rotate: -360,
        duration: 28,
        repeat: -1,
        ease: 'none',
      });
    },
    { scope: containerRef }
  );

  const angleStep = (2 * Math.PI) / techStack.length;

  return (
    <div
      ref={containerRef}
      className="wheel-perspective relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="Tech stack icon wheel"
      role="img"
    >
      {/* Centre dot */}
      <div className="absolute w-2 h-2 rounded-full bg-[#242424]" aria-hidden="true" />

      {/* Outer ring guide */}
      <div
        className="absolute rounded-full border border-[#242424]/50"
        style={{ width: size - iconSize, height: size - iconSize }}
        aria-hidden="true"
      />

      {/* Wheel */}
      <div
        ref={wheelRef}
        className="wheel-flip absolute"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {techStack.map((tech, i) => {
          const angle = i * angleStep - Math.PI / 2; // start at top
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <div
              key={tech.name}
              className="wheel-icon absolute"
              style={{
                width: iconSize,
                height: iconSize,
                left: size / 2 - iconSize / 2 + x,
                top: size / 2 - iconSize / 2 + y,
              }}
              title={tech.name}
            >
              <div className="w-full h-full rounded-xl border border-[#242424] bg-[#141414] flex items-center justify-center overflow-hidden">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={iconSize - 16}
                  height={iconSize - 16}
                  className="wheel-icon-img object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  onError={(e) => {
                    // Show initial as fallback if icon missing
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.className = 'text-[10px] font-semibold text-[#8a8a8a]';
                      span.textContent = tech.name.slice(0, 2).toUpperCase();
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
