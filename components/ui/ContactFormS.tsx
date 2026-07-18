'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A hidden, cat-themed "I love you" reveal for Iqra.
 *
 * Listens globally (but ignores form fields) for the typed phrase
 * "i love you" — case-insensitive, with or without spaces. When matched it
 * reveals a cute animated card and plays a gentle romantic loop synthesized
 * with the Web Audio API (no asset file required). Nothing renders until
 * triggered, so it stays completely invisible in the UI.
 */

const SPACED = 'i love you';
const COMPACT = 'iloveyou';

interface Heart {
  left: number;
  delay: number;
  dur: number;
  scale: number;
  rot: number;
  char: string;
}

const HEART_CHARS = ['💗', '💕', '💖', '🐾', '🌸', '❤️', '🐱', '🐾'];

function makeHearts(): Heart[] {
  return Array.from({ length: 18 }, (_, i) => ({
    left: (i * 5.5 + Math.random() * 4) % 100,
    delay: Math.random() * 7,
    dur: 7 + Math.random() * 6,
    scale: 0.7 + Math.random() * 0.9,
    rot: Math.random() * 60 - 30,
    char: HEART_CHARS[i % HEART_CHARS.length],
  }));
}

/* ── Romantic loop (synthesized, no audio asset) ───────────────── */
const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
};
// Warm pad per 2s segment — I–vi–IV–V in C major.
const PAD: string[][] = [
  ['C3', 'G3', 'C4', 'E4'],
  ['A3', 'E4', 'A4'],
  ['F3', 'C4', 'F4'],
  ['G3', 'D4', 'G4', 'B4'],
];
// Melody: [note, beatIndex (0..15), durationInBeats].
const MELODY: [string, number, number][] = [
  ['E4', 0, 1], ['G4', 1, 1], ['E4', 2, 1], ['C4', 3, 1],
  ['A4', 4, 1], ['C5', 5, 1], ['A4', 6, 1], ['G4', 7, 1],
  ['F4', 8, 1], ['A4', 9, 1], ['F4', 10, 1], ['D4', 11, 1],
  ['G4', 12, 1], ['B4', 13, 1], ['G4', 14, 1], ['D4', 15, 1],
];
const BEAT = 0.5; // seconds
const LOOP = 8; // seconds (16 beats)

function playNote(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  peak: number,
  voices: Set<OscillatorNode>,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const attack = type === 'sine' ? 0.02 : 0.05;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur + (type === 'triangle' ? 0.4 : 0.2));
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.5);
  voices.add(osc);
  osc.onended = () => {
    try {
      osc.disconnect();
      gain.disconnect();
    } catch {
      /* already torn down */
    }
    voices.delete(osc);
  };
}

function scheduleLoop(ctx: AudioContext, startTime: number, voices: Set<OscillatorNode>) {
  PAD.forEach((chord, seg) => {
    const start = startTime + seg * 2;
    chord.forEach((n) => playNote(ctx, NOTE[n], start, 2.0, 'triangle', 0.05, voices));
  });
  MELODY.forEach(([n, beat, dur]) => {
    playNote(ctx, NOTE[n], startTime + beat * BEAT, dur * BEAT, 'sine', 0.14, voices);
  });
}

function CatSvg() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      {/* ears (twitch on hover) */}
      <g className="cat-ears group-hover:cat-ears-tw">
        <path d="M58 78 L36 16 L98 54 Z" fill="#f7f1ea" />
        <path d="M182 78 L204 16 L142 54 Z" fill="#f7f1ea" />
        <path d="M56 66 L46 30 L84 56 Z" fill="#ffb3c6" />
        <path d="M184 66 L194 30 L156 56 Z" fill="#ffb3c6" />
      </g>
      {/* head */}
      <ellipse cx="120" cy="134" rx="80" ry="72" fill="#f7f1ea" />
      {/* blush */}
      <ellipse cx="74" cy="152" rx="15" ry="9" fill="#ffb3c6" opacity="0.7" />
      <ellipse cx="166" cy="152" rx="15" ry="9" fill="#ffb3c6" opacity="0.7" />
      {/* eyes */}
      <g className="cat-eyes">
        <ellipse cx="92" cy="124" rx="11" ry="14" fill="#2b2b2b" />
        <ellipse cx="148" cy="124" rx="11" ry="14" fill="#2b2b2b" />
        <circle cx="96" cy="119" r="3.6" fill="#ffffff" />
        <circle cx="152" cy="119" r="3.6" fill="#ffffff" />
      </g>
      {/* nose */}
      <path d="M120 142 l-7 7 h14 z" fill="#ff8fab" />
      {/* mouth */}
      <path
        d="M120 149 q-10 10 -20 2 M120 149 q10 10 20 2"
        stroke="#2b2b2b"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* rose held in paw */}
      <g>
        {/* stem */}
        <path
          d="M150 206 q4 -12 14 -22"
          stroke="#5b9a5b"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* leaf */}
        <path d="M158 192 q16 -3 20 9 q-16 5 -20 -9 z" fill="#6fb36f" />
        {/* bloom */}
        <g className="cat-rose">
          <circle cx="166" cy="182" r="15" fill="#e2455c" />
          <path
            d="M166 182 C 162 177, 171 175, 172 181 C 173 188, 159 189, 159 181 C 159 173, 174 171, 176 182"
            fill="none"
            stroke="#a82c3e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="166" cy="182" r="3" fill="#a82c3e" />
        </g>
        {/* paw gripping the stem */}
        <g>
          <ellipse cx="146" cy="214" rx="22" ry="13" fill="#f7f1ea" />
          <circle cx="133" cy="205" r="5.5" fill="#f7f1ea" />
          <circle cx="146" cy="202" r="5.5" fill="#f7f1ea" />
          <circle cx="159" cy="205" r="5.5" fill="#f7f1ea" />
        </g>
      </g>
      {/* whiskers */}
      <g stroke="#cbb9a8" strokeWidth="2" strokeLinecap="round">
        <path d="M58 134 L18 128" />
        <path d="M58 142 L20 144" />
        <path d="M182 134 L222 128" />
        <path d="M182 142 L220 144" />
      </g>
    </svg>
  );
}

export default function ContactFormS() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const bufferRef = useRef('');
  const resetTimer = useRef<number | null>(null);
  const isOpenRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const songState = useRef<{ voices: Set<OscillatorNode>; timer: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      audioCtxRef.current = new Ctor();
    }
    return audioCtxRef.current;
  }, []);

  const startSong = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || songState.current) return;
    const voices = new Set<OscillatorNode>();
    const startTime = ctx.currentTime + 0.1;
    scheduleLoop(ctx, startTime, voices);
    let next = startTime + LOOP;
    const timer = window.setInterval(() => {
      if (!songState.current) return;
      scheduleLoop(ctx, next, voices);
      next += LOOP;
    }, LOOP * 1000);
    songState.current = { voices, timer };
  }, []);

  const stopSong = useCallback(() => {
    const s = songState.current;
    if (!s) return;
    clearInterval(s.timer);
    s.voices.forEach((v) => {
      try {
        v.stop();
      } catch {
        /* already stopped */
      }
    });
    songState.current = null;
  }, []);

  const close = useCallback(() => {
    isOpenRef.current = false;
    setOpen(false);
  }, []);

  const trigger = useCallback(() => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    const ctx = ensureCtx();
    if (ctx) void ctx.resume();
    setHearts(makeHearts());
    setOpen(true);
  }, [ensureCtx]);

  /* Global keystroke detection — matches "i love you" (case-insensitive,
     with or without spaces). Ignored while typing in a field or while open. */
  useEffect(() => {
    const clearReset = () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
        resetTimer.current = null;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (isOpenRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
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
        // any off-phrase key resets the armed buffer
        bufferRef.current = '';
        clearReset();
        return;
      }
      // Space scrolls the page by default — suppress it only once we're
      // capturing the phrase, so normal space-scrolling still works.
      if (key === ' ' && bufferRef.current.length > 0) e.preventDefault();
      bufferRef.current = (bufferRef.current + key).slice(-SPACED.length);
      clearReset();
      resetTimer.current = window.setTimeout(() => {
        bufferRef.current = '';
      }, 2000);
      const compact = bufferRef.current.replace(/\s+/g, '');
      if (bufferRef.current === SPACED || compact.endsWith(COMPACT)) {
        bufferRef.current = '';
        clearReset();
        trigger();
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
  }, [trigger]);

  /* Body scroll lock + focus handling while open. */
  useEffect(() => {
    if (!open) {
      lastFocusedRef.current?.focus?.();
      return;
    }
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open]);

  /* Escape to close. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  /* Romantic loop follows open + mute state. */
  useEffect(() => {
    if (!open) return;
    if (!muted) startSong();
    return () => stopSong();
  }, [open, muted, startSong, stopSong]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1a0e16]/85 to-[#0a0a0a]/85 backdrop-blur-md"
        onClick={close}
        aria-hidden="true"
      />

      {/* Floating hearts */}
      <div
        className="love-hearts pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {hearts.map((h, i) => (
          <span
            key={i}
            className="love-heart text-2xl md:text-3xl"
            style={
              {
                left: `${h.left}%`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.dur}s`,
                '--r': `${h.rot}deg`,
                transform: `scale(${h.scale})`,
              } as React.CSSProperties
            }
          >
            {h.char}
          </span>
        ))}
      </div>

      {/* Card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="love-title"
        tabIndex={-1}
        className="love-card group relative w-full max-w-md rounded-[28px] border border-[#ff8fab]/30 bg-[#141414] p-8 text-center shadow-2xl shadow-[#ff8fab]/10 outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8a8a] transition-colors hover:bg-white/[0.06] hover:text-[#fafafa]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* hover-only sparkle hearts */}
        <span className="love-hover-heart pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-xl opacity-0 transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-100">
          💞
        </span>
        <span className="love-hover-heart pointer-events-none absolute left-[20%] top-10 text-base opacity-0 transition-all delay-75 duration-300 group-hover:opacity-100">
          🐾
        </span>
        <span className="love-hover-heart pointer-events-none absolute right-[20%] top-10 text-base opacity-0 transition-all delay-75 duration-300 group-hover:opacity-100">
          💗
        </span>

        <div className="cat-bob mx-auto -mt-2 w-36">
          <div className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <CatSvg />
          </div>
        </div>

        <p className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-[#ff8fab]">
          a little secret 🐾
        </p>

        <h2
          id="love-title"
          className="font-cursive text-4xl leading-tight text-[#fafafa] md:text-5xl"
        >
          I love you, Iqra
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[#a8a8a8]">
          Every line of code I write is a tiny love letter to you. You make my
          whole world brighter. 💗
        </p>

        <p className="love-heartbeat mt-4 font-cursive text-lg text-[#ff8fab]">
          — Rahman
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="cursor-pointer rounded-full border border-[#242424] px-4 py-2.5 text-sm font-medium text-[#8a8a8a] transition hover:text-[#fafafa] active:scale-95"
            aria-pressed={muted}
          >
            {muted ? '🔇 sound off' : '🔊 sound on'}
          </button>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-full border border-[#fafafa] bg-[#fafafa] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fafafa] active:scale-95"
          >
            close 💕
          </button>
        </div>
      </div>
    </div>
  );
}
