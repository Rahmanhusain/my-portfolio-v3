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

    /*
     * Scroll for the in-page links the router treats as a no-op.
     *
     * `next/link` compares the target URL against the current one. When only
     * the fragment is involved it either finds them identical and does nothing,
     * or swaps the fragment without scrolling — and since the URL barely
     * changes the browser fires no `hashchange`, so `onHashChange` above never
     * runs either. Two dead controls come out of that:
     *
     *   • "About" at `/#about` — click it after scrolling away and nothing
     *     happens, because the URL is already exactly `/#about`.
     *   • The "Rahman" wordmark at `/#about` — it points at `/`, which is a
     *     fragment-only change, so the page never returns to the top.
     *
     * A plain `<a href="#x">` re-scrolls on its own; this is specific to
     * router-intercepted links, which is why the article TOCs never had it.
     *
     * Two details this depends on, both verified against the router's source:
     *
     * 1. **Capture phase.** `Link` calls `preventDefault()` unconditionally for
     *    local URLs, and React's delegated listener sits on `document` — so a
     *    bubble-phase listener here would see `defaultPrevented` already true
     *    on every single link click and could never tell the dead ones apart.
     * 2. **No `preventDefault()` of our own.** `Link` bails out of navigating
     *    when it sees the event already prevented, and the wordmark case *does*
     *    need it to navigate, so the `#about` actually drops off the URL. We
     *    only add the scroll the router omits; propagation is left alone so
     *    per-link `onClick` handlers (the mobile menu's close, for one) still
     *    fire.
     */
    const onInPageLinkClick = (event: MouseEvent) => {
      // Leave modified and middle clicks to the browser — they open tabs and
      // windows, and hijacking them is always wrong.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor =
        event.target instanceof Element ? event.target.closest('a') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      const here = window.location;
      if (url.origin !== here.origin) return;
      if (url.pathname !== here.pathname || url.search !== here.search) return;

      // When the fragment genuinely changes the router scrolls for us. Stay
      // out of the way, or the two scrolls fight each other.
      const sameFragment = url.hash === here.hash;
      const clearingFragment = !url.hash && Boolean(here.hash);
      if (!sameFragment && !clearingFragment) return;

      if (url.hash.length > 1) {
        // An id that is not a valid CSS selector — one starting with a digit,
        // say — makes querySelector throw rather than return null.
        let target: Element | null = null;
        try {
          target = document.querySelector(url.hash);
        } catch {
          return;
        }
        if (!target) return;

        // Deliberately not `immediate`: this is an explicit click, so easing
        // is the expected feel, and travelling through the sections lets their
        // reveal triggers fire on the way rather than needing
        // `resolvePassedTriggers` to force them.
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      } else {
        lenis.scrollTo(0);
      }
    };

    document.addEventListener('click', onInPageLinkClick, true);

    return () => {
      cancelAnimationFrame(initRafId);
      if (jumpCleanup) jumpCleanup();
      window.removeEventListener('hashchange', onHashChange);
      // The `true` matters — a capture listener is only removable by a
      // matching capture removal.
      document.removeEventListener('click', onInPageLinkClick, true);
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
