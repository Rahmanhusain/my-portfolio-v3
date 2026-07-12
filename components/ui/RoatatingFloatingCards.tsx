"use client";

import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { techStack } from "@/lib/data/techStack";

const W = 120;
const H = 160;
const RADIUS = 270;
const SCENE_W = 580;
const SCENE_H = 440;
const PERSPECTIVE = 1100;
const OVERFLOW_FACTOR = 1.14;
const MIN_SCALE = 0.32;

const TILT_X_BASE = -13;
const TILT_Z_BASE = 12;
const IDLE_SPEED = 15;        // deg/s
const DRAG_SENSITIVITY = 0.38;
const MOMENTUM_FRICTION = 0.975;
const IDLE_LERP = 0.028;

const HOVER_TILT_MAX = 10;     // max extra degrees on each axis from hover
const TILT_LERP = 0.07;       // how quickly tilt follows the cursor (0-1)
const SCROLL_BOOST = 0.40;    // deltaY → velocity multiplier

export default function RotatingFloatingCards() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const entranceRef= useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<HTMLDivElement>(null);
  const poseRef    = useRef<HTMLDivElement>(null);
  const wheelRef   = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const [scale, setScale] = useState(1);

  const state = useRef({
    // spin
    rotation: 0,
    velocity: IDLE_SPEED,
    dragging: false,
    lastPointerX: 0,
    lastPointerTime: 0,
    lastFrameTime: 0,
    raf: 0,
    // tilt targets (set by mouse events)
    targetTiltX: 0,
    targetTiltY: 0,
    // tilt currents (lerped inside tick)
    currentTiltX: 0,
    currentTiltY: 0,
  });

  const cards = techStack.slice(0, 8);
  const angleStep = 360 / cards.length;

  // ── Responsive scale ────────────────────────────────────────────
  const updateScale = useCallback(() => {
    const parent = wrapRef.current?.parentElement;
    if (!parent) return;
    const availableW = parent.clientWidth;
    const availableH = window.innerHeight * 0.52;
    const next = Math.min(
      availableW / (SCENE_W * OVERFLOW_FACTOR),
      availableH / (SCENE_H * OVERFLOW_FACTOR),
      1,
    );
    setScale(Math.max(next, MIN_SCALE));
  }, []);

  useEffect(() => {
    updateScale();
    const parent = wrapRef.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(parent);
    window.addEventListener("resize", updateScale);
    return () => { ro.disconnect(); window.removeEventListener("resize", updateScale); };
  }, [updateScale]);

  // ── Main animation setup ─────────────────────────────────────────
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Entrance
    const cardEls = sceneRef.current?.querySelectorAll<HTMLElement>(".fcard");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      entranceRef.current,
      { opacity: 0, scale: 0.82, y: 22 },
      { opacity: 1, scale: 1, y: 0, duration: 1 },
    );
    if (cardEls) {
      tl.fromTo(
        cardEls,
        { opacity: 0, scale: 0.55 },
        { opacity: 1, scale: 1, duration: 0.9, stagger: 0.06, ease: "back.out(1.5)" },
        0.18,
      );
    }

    // ── Tick — spin + tilt in one RAF loop, no GSAP interference ───
    const tick = (time: number) => {
      const s = state.current;
      const dt = s.lastFrameTime ? (time - s.lastFrameTime) / 1000 : 0;
      s.lastFrameTime = time;

      // Velocity → idle
      if (!s.dragging) {
        if (Math.abs(s.velocity) > IDLE_SPEED * 1.4) {
          s.velocity *= MOMENTUM_FRICTION;
        } else {
          s.velocity += (IDLE_SPEED - s.velocity) * IDLE_LERP;
        }
      }
      s.rotation += s.velocity * dt;

      // Spin layer
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotateY(${s.rotation}deg)`;
      }

      // Per-card depth cues
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rad = ((i * angleStep + s.rotation) * Math.PI) / 180;
        const depth = Math.cos(rad);
        el.style.zIndex  = String(Math.round((depth + 1) * 50));
        el.style.opacity = String(0.72 + depth * 0.28);
        gsap.set(el, { scale: 0.88 + depth * 0.12 });
      });

      // Lerp tilt toward target (all inside the same RAF — no GSAP quickTo)
      s.currentTiltX += (s.targetTiltX - s.currentTiltX) * TILT_LERP;
      s.currentTiltY += (s.targetTiltY - s.currentTiltY) * TILT_LERP;

      if (poseRef.current) {
        poseRef.current.style.transform = [
          `rotateZ(${TILT_Z_BASE}deg)`,
          `rotateX(${TILT_X_BASE + s.currentTiltX}deg)`,
          `rotateY(${s.currentTiltY}deg)`,
        ].join(" ");
      }

      s.raf = requestAnimationFrame(tick);
    };

    state.current.lastFrameTime = 0;
    state.current.raf = requestAnimationFrame(tick);

    // ── Drag ────────────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      const s = state.current;
      s.dragging = true;
      s.lastPointerX = e.clientX;
      s.lastPointerTime = performance.now();
      sceneRef.current?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = state.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.lastPointerX;
      const now = performance.now();
      const dt = Math.max(now - s.lastPointerTime, 1);
      s.rotation += dx * DRAG_SENSITIVITY;
      s.velocity  = (dx / dt) * DRAG_SENSITIVITY * 1000;
      s.lastPointerX   = e.clientX;
      s.lastPointerTime = now;
    };

    const onPointerUp = () => { state.current.dragging = false; };

    // ── Hover tilt — writes target, tick lerps toward it ────────────
    const onMouseMove = (e: MouseEvent) => {
      const el = sceneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Normalised -1 → +1 relative to center
      const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
      // Opposite direction: right → tilt left, down → tilt up
      state.current.targetTiltY = -nx * HOVER_TILT_MAX;
      state.current.targetTiltX =  ny * HOVER_TILT_MAX;
    };

    const onMouseLeave = () => {
      state.current.targetTiltX = 0;
      state.current.targetTiltY = 0;
    };

    // ── Scroll boost — on window so Lenis doesn't swallow it ────────
    const onWheel = (e: WheelEvent) => {
      state.current.velocity += e.deltaY * SCROLL_BOOST;
    };

    const el = sceneRef.current;
    el?.addEventListener("pointerdown",  onPointerDown);
    el?.addEventListener("pointermove",  onPointerMove);
    el?.addEventListener("mousemove",    onMouseMove);
    el?.addEventListener("mouseleave",   onMouseLeave);
    // wheel on window so Lenis doesn't intercept it
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(state.current.raf);
      el?.removeEventListener("pointerdown",  onPointerDown);
      el?.removeEventListener("pointermove",  onPointerMove);
      el?.removeEventListener("mousemove",    onMouseMove);
      el?.removeEventListener("mouseleave",   onMouseLeave);
      window.removeEventListener("wheel",     onWheel);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [angleStep]);

  return (
    <div
      ref={wrapRef}
      className="w-full flex justify-center overflow-hidden"
      style={{ height: SCENE_H * scale }}
    >
      <div
        ref={entranceRef}
        style={{
          width: SCENE_W * scale,
          height: SCENE_H * scale,
          opacity: 0,
          transform: "translateY(22px) scale(0.82)",
          transformOrigin: "center center",
        }}
      >
        <div
          ref={sceneRef}
          className="relative select-none cursor-grab active:cursor-grabbing touch-none"
          style={{
            width: SCENE_W,
            height: SCENE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            perspective: PERSPECTIVE,
            perspectiveOrigin: "48% 40%",
          }}
          aria-label="Interactive 3D tech stack carousel"
          role="img"
        >
          {/* Pose layer — orientation managed entirely by the tick loop */}
          <div
            ref={poseRef}
            className="absolute inset-0"
            style={{
              transform: `rotateZ(${TILT_Z_BASE}deg) rotateX(${TILT_X_BASE}deg)`,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 50%",
            }}
          >
            {/* Spin layer */}
            <div
              ref={wheelRef}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}
            >
              {/* Ring guide */}
              <div
                className="absolute pointer-events-none"
                aria-hidden="true"
                style={{
                  width: RADIUS * 2,
                  height: RADIUS * 2,
                  left: `calc(50% - ${RADIUS}px)`,
                  top:  `calc(50% - ${RADIUS}px)`,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "50%",
                  transform: "rotateX(90deg)",
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 0 40px rgba(255,255,255,0.02), inset 0 0 30px rgba(255,255,255,0.015)",
                }}
              />

              {cards.map((tech, i) => (
                <div
                  key={tech.name}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="fcard absolute rounded-2xl overflow-hidden border border-white/10 bg-surface"
                  style={{
                    width: W,
                    height: H,
                    left: `calc(50% - ${W / 2}px)`,
                    top:  `calc(50% - ${H / 2}px)`,
                    transform: `rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        style={{ filter: "brightness(0) invert(1) opacity(0.85)" }}
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.style.display = "none";
                          const p = t.parentElement;
                          if (p && !p.querySelector("span")) {
                            const sp = document.createElement("span");
                            sp.className = "text-2xl font-bold text-white/40";
                            sp.textContent = tech.name.slice(0, 2).toUpperCase();
                            p.appendChild(sp);
                          }
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-white/40 tracking-wide">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
