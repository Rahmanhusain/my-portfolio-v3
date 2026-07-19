'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A hidden, cat-themed "I love you" surprise for Iqra.
 *
 * Listens globally (but ignores form fields) for a typed secret phrase. The
 * phrase itself is never shipped to the browser — it lives in the server-only
 * `CAT_SECRET_PHRASE` env var, and the client only ever receives its SHA-256
 * hash (via `/api/secret`) to match keystrokes against. When matched, a
 * cute cat appears at the cursor, trails the mouse, and reacts to movement:
 * at rest it shows "i Love you iqra babu"; while the mouse moves it switches
 * to "cutieeeeeeee" with an excited face. Nothing renders until triggered, so
 * the page's server-rendered HTML (and therefore SEO) is untouched.
 */

/** SHA-256 → lowercase hex, using the browser's Web Crypto (secure contexts). */
async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function CatCursorSvg({ moving }: { moving: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {/* ears */}
      <path d="M62 74 L40 12 L104 52 Z" fill="#f7f1ea" />
      <path d="M178 74 L200 12 L136 52 Z" fill="#f7f1ea" />
      <path d="M60 62 L48 26 L94 54 Z" fill="#ffb3c6" />
      <path d="M180 62 L192 26 L146 54 Z" fill="#ffb3c6" />
      {/* head */}
      <ellipse cx="120" cy="126" rx="82" ry="74" fill="#f7f1ea" />
      {/* blush */}
      <ellipse cx="72" cy="146" rx={moving ? 17 : 15} ry={moving ? 11 : 9} fill="#ffb3c6" opacity={moving ? 0.85 : 0.7} />
      <ellipse cx="168" cy="146" rx={moving ? 17 : 15} ry={moving ? 11 : 9} fill="#ffb3c6" opacity={moving ? 0.85 : 0.7} />
      {/* eyes */}
      {moving ? (
        <g stroke="#2b2b2b" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M82 128 Q92 110 102 128" />
          <path d="M138 128 Q148 110 158 128" />
        </g>
      ) : (
        <g className="cat-eyes">
          <ellipse cx="92" cy="126" rx="11" ry="14" fill="#2b2b2b" />
          <ellipse cx="148" cy="126" rx="11" ry="14" fill="#2b2b2b" />
          <circle cx="96" cy="121" r="3.6" fill="#ffffff" />
          <circle cx="152" cy="121" r="3.6" fill="#ffffff" />
        </g>
      )}
      {/* nose */}
      <path d="M120 142 l-7 7 h14 z" fill="#ff8fab" />
      {/* mouth */}
      {moving ? (
        <g>
          <path d="M110 150 Q120 166 130 150 Z" fill="#7a2e3a" />
          <path d="M115 156 Q120 165 125 156 Q120 161 115 156 Z" fill="#ff8fab" />
        </g>
      ) : (
        <path
          d="M120 149 q-10 10 -20 2 M120 149 q10 10 20 2"
          stroke="#2b2b2b"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* whiskers */}
      <g stroke="#cbb9a8" strokeWidth="2" strokeLinecap="round">
        <path d="M52 128 L14 122" />
        <path d="M52 136 L16 138" />
        <path d="M188 128 L226 122" />
        <path d="M188 136 L224 138" />
      </g>
      {/* rose held up beside the cheek */}
      <g>
        {/* stem */}
        <path d="M186 210 q-4 -30 -14 -52" stroke="#5b9a5b" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* leaf */}
        <path d="M178 176 q-16 -2 -20 10 q16 6 20 -10 z" fill="#6fb36f" />
        {/* bloom */}
        <g className="cat-rose">
          <circle cx="172" cy="156" r="16" fill="#e2455c" />
          <path
            d="M172 156 C168 151, 177 149, 178 155 C179 162, 165 163, 165 155 C165 147, 180 145, 182 156"
            fill="none"
            stroke="#a82c3e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="172" cy="156" r="3" fill="#a82c3e" />
        </g>
        {/* little paw gripping the stem */}
        <ellipse cx="188" cy="212" rx="15" ry="11" fill="#f7f1ea" />
        <circle cx="182" cy="216" r="3" fill="#ffb3c6" />
        <circle cx="189" cy="217" r="3" fill="#ffb3c6" />
        <circle cx="196" cy="216" r="3" fill="#ffb3c6" />
      </g>
    </svg>
  );
}

export default function ContactFormS() {
  const [active, setActive] = useState(false);
  const [moving, setMoving] = useState(false);

  const isActiveRef = useRef(false);
  const catRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const moveTimer = useRef<number | null>(null);
  const movingRef = useRef(false);
  const bufferRef = useRef('');
  const resetTimer = useRef<number | null>(null);
  const secretRef = useRef<{ hash: string; length: number } | null>(null);

  const close = useCallback(() => {
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (moveTimer.current) clearTimeout(moveTimer.current);
    movingRef.current = false;
    setMoving(false);
    setActive(false);
  }, []);

  const startLoop = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => {
      const p = positionRef.current;
      const t = targetRef.current;
      const f = reduce ? 1 : 0.2;
      p.x += (t.x - p.x) * f;
      p.y += (t.y - p.y) * f;
      if (catRef.current) {
        catRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const activate = useCallback(() => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    const m =
      mouseRef.current.x || mouseRef.current.y
        ? mouseRef.current
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetRef.current = { ...m };
    positionRef.current = { ...m };
    if (catRef.current) {
      catRef.current.style.transform = `translate(${m.x}px, ${m.y}px)`;
    }
    setMoving(false);
    startLoop();
    setActive(true);
  }, [startLoop]);

  /* Fetch the trigger's hash (never the plaintext) once on mount. */
  useEffect(() => {
    let cancelled = false;
    fetch('/api/secret')
      .then((r) => r.json())
      .then((d: { hash?: string; length?: number }) => {
        if (!cancelled && d?.hash && d?.length) {
          secretRef.current = { hash: d.hash, length: d.length };
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /* Global keystroke detection — matches the secret phrase (case-insensitive,
     spaces ignored) by comparing a rolling hash to the server-provided one.
     Ignored while typing in a field or while active. */
  useEffect(() => {
    const clearReset = () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (isActiveRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const secret = secretRef.current;
      if (!secret) return; // hash not loaded yet
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        t?.isContentEditable
      ) {
        return; // never hijack typing in form fields
      }
      const key = e.key.toLowerCase();
      if (key === 'backspace') {
        bufferRef.current = bufferRef.current.slice(0, -1);
        return;
      }
      if (!/^[a-z ]$/.test(key)) {
        bufferRef.current = '';
        clearReset();
        return;
      }
      if (key === ' ') {
        // Space scrolls the page by default — suppress it only once we're
        // capturing the phrase, so normal space-scrolling still works.
        // Spaces aren't part of the compared (compact) buffer.
        if (bufferRef.current.length > 0) e.preventDefault();
      } else {
        bufferRef.current = (bufferRef.current + key).slice(-secret.length);
      }
      clearReset();
      resetTimer.current = window.setTimeout(() => {
        bufferRef.current = '';
      }, 2000);
      if (bufferRef.current.length === secret.length) {
        const candidate = bufferRef.current;
        sha256Hex(candidate).then((h) => {
          if (h === secret.hash && !isActiveRef.current) {
            bufferRef.current = '';
            clearReset();
            activate();
          }
        });
      }
    };
    const onBlur = () => {
      bufferRef.current = '';
      clearReset();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
      clearReset();
    };
  }, [activate]);

  /* Track the mouse: always remember position (for spawn point), and while
     active update the target + toggle the "moving" expression at the edges
     (not on every pixel) to avoid render storms. */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isActiveRef.current) return;
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!movingRef.current) {
        movingRef.current = true;
        setMoving(true);
      }
      if (moveTimer.current) clearTimeout(moveTimer.current);
      moveTimer.current = window.setTimeout(() => {
        movingRef.current = false;
        setMoving(false);
      }, 450);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* Dismiss on Escape or click anywhere. */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    const onClick = () => close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [active, close]);

  if (!active) return null;

  return (
    <div
      ref={catRef}
      className="fixed left-0 top-0 z-[200] pointer-events-none will-change-transform"
      aria-hidden="true"
    >
      <div className="relative" style={{ transform: 'translate(-50%, -90%)' }}>
        {/* speech bubble */}
        <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-gradient-to-br from-[#fff0f5] to-[#ffe0ec] px-5 py-2.5 text-lg font-bold text-[#c2185b] shadow-xl ring-1 ring-[#ffb3c6]/60">
          <span
            key={moving ? 'move' : 'rest'}
            className="love-bubble-text"
            style={{ fontFamily: 'var(--font-cursive), cursive' }}
          >
            {moving ? '😽 cutieeee.... 💕✨' : '💖 I Love You Iqra Babu 🌹'}
          </span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-[10px] border-transparent border-t-[#ffe0ec]" />
        </div>
        {/* cat */}
        <div className="cat-bob mx-auto w-24">
          <CatCursorSvg moving={moving} />
        </div>
      </div>
    </div>
  );
}
