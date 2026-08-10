'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * The phase this runs in is load-bearing here, not a micro-optimisation — see
 * the teardown note below. The server fallback only exists to silence React's
 * "useLayoutEffect does nothing on the server" warning during SSR.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  /*
   * This MUST be a layout effect, because of when its *cleanup* runs.
   *
   * Next's `ScrollAndFocusHandler` is a class component that scrolls the new
   * page to the top from `componentDidUpdate` — the layout phase. React runs
   * `useEffect` cleanups in the passive phase, which is *after* that. So with
   * a passive effect the order on every navigation away from the homepage was:
   *
   *   1. Next sets `documentElement.scrollTop = 0`
   *   2. …Lenis and the ScrollTrigger scrollerProxy are still installed, still
   *      driven by the GSAP ticker, and still holding the old offset — so they
   *      put the scroll position straight back
   *   3. only then does this cleanup destroy them
   *
   * which left the new page sitting at the homepage's scroll offset. A layout
   * effect's cleanup runs in the mutation phase instead, so every piece of
   * scroll machinery is gone *before* the router touches the scroll position.
   *
   * Note this fixes the ordering rather than forcing a scroll of our own —
   * forcing one here would break the browser's back/forward scroll restoration.
   */
  useIsomorphicLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Force-completes all animations whose trigger start is already behind
    // the current scroll position, making those sections fully visible.
    const resolvePassedTriggers = () => {
      const pos = lenis.scroll;
      ScrollTrigger.getAll().forEach((st) => {
        if (st.start <= pos) {
          st.animation?.progress(1);
        }
      });
      ScrollTrigger.refresh();
    };

    // Jumps to a hash target and resolves all passed triggers.
    // Polls until the trigger count stabilises (all child useEffects done),
    // then performs the jump.
    const jumpToHash = (hash: string) => {
      const target = document.querySelector(hash);
      if (!target) return;

      let lastCount = -1;
      let stabilityTimer: ReturnType<typeof setTimeout> | null = null;
      let pollRaf: number;

      const doJump = () => {
        cancelAnimationFrame(pollRaf);
        ScrollTrigger.refresh();
        lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -80 });
        requestAnimationFrame(resolvePassedTriggers);
      };

      const poll = () => {
        const count = ScrollTrigger.getAll().length;
        if (count !== lastCount) {
          lastCount = count;
          if (stabilityTimer) clearTimeout(stabilityTimer);
          // 60ms of no new triggers = all sections have registered
          stabilityTimer = setTimeout(doJump, 60);
        }
        pollRaf = requestAnimationFrame(poll);
      };

      // Safety net — always jump by 600ms no matter what
      const safety = setTimeout(() => {
        cancelAnimationFrame(pollRaf);
        if (stabilityTimer) clearTimeout(stabilityTimer);
        doJump();
      }, 600);

      pollRaf = requestAnimationFrame(poll);

      // Return cleanup
      return () => {
        cancelAnimationFrame(pollRaf);
        if (stabilityTimer) clearTimeout(stabilityTimer);
        clearTimeout(safety);
      };
    };

    let jumpCleanup: (() => void) | undefined;
    let initRafId: number;

    // Wait two frames for the browser to paint and React to flush all
    // child effects before we check the hash or start polling.
    initRafId = requestAnimationFrame(() => {
      initRafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        const hash = window.location.hash;
        if (hash) {
          jumpCleanup = jumpToHash(hash);
        }
      });
    });

    // Next.js client-side navigation sets the hash AFTER the component
    // mounts — so we also listen for hashchange to catch that case.
    const onHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;
      if (jumpCleanup) jumpCleanup();
      // Small delay so the DOM has settled after the route change
      const t = setTimeout(() => {
        jumpCleanup = jumpToHash(hash);
      }, 50);
      // Store cleanup ref for the hashchange handler itself
      jumpCleanup = () => clearTimeout(t);
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      cancelAnimationFrame(initRafId);
      if (jumpCleanup) jumpCleanup();
      window.removeEventListener('hashchange', onHashChange);
      // Order matters: stop the ticker driving Lenis first, so nothing can
      // animate the scroll position while the rest of this is torn down.
      gsap.ticker.remove(ticker);

      // Kill the homepage's triggers before dropping the proxy. A surviving
      // ScrollTrigger would `refresh()` on the next resize — and refresh
      // saves and restores the scroll position, which is exactly the jump
      // this teardown exists to prevent.
      ScrollTrigger.getAll().forEach((st) => st.kill());

      ScrollTrigger.scrollerProxy(document.documentElement, undefined as never);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
