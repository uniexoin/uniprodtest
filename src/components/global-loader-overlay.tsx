'use client';

import { useUIStore } from '@/store/ui.store';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function GlobalLoaderOverlay() {
  const { isLoadingOverlayOpen, showLoadingOverlay, hideLoadingOverlay } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Route transition detection (Link clicks)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, blank targets, hash links, phone, email etc
      if (
        (href.startsWith('http') && !href.startsWith(window.location.origin)) ||
        anchor.getAttribute('target') === '_blank' ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      // Ignore if user clicks to open in a new tab/window
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Ignore if the href is the same as the current pathname (prevent loader stuck)
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);
      if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
        return;
      }

      showLoadingOverlay();
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [showLoadingOverlay]);

  // Hide overlay on navigation change
  useEffect(() => {
    hideLoadingOverlay();
  }, [pathname, searchParams, hideLoadingOverlay]);

  // API Request interception (window.fetch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    let activeRequests = 0;
    let showTimer: any = null;

    window.fetch = async (...args) => {
      activeRequests++;

      // Trigger loader only if requests take more than 250ms (prevents flicker on fast APIs)
      if (!showTimer) {
        showTimer = setTimeout(() => {
          if (activeRequests > 0) {
            showLoadingOverlay();
          }
        }, 250);
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        activeRequests--;
        if (activeRequests <= 0) {
          if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
          }
          hideLoadingOverlay();
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
      if (showTimer) {
        clearTimeout(showTimer);
      }
    };
  }, [showLoadingOverlay, hideLoadingOverlay]);

  // Load Lottie animation
  useEffect(() => {
    if (!isLoadingOverlayOpen || typeof window === 'undefined' || !containerRef.current) return;

    let anim: any;
    import('lottie-web').then((lottieModule) => {
      anim = lottieModule.default.loadAnimation({
        container: containerRef.current!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/loading_animation.json',
      });
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, [isLoadingOverlayOpen]);

  return (
    <AnimatePresence>
      {isLoadingOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/75 backdrop-blur-md text-white pointer-events-auto"
        >
          <div className="max-w-md w-full p-8 text-center space-y-4">
            <div ref={containerRef} className="w-36 h-36 sm:w-48 sm:h-48 mx-auto max-w-full" />
            <motion.h4
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="text-xs font-black uppercase tracking-[0.25em] text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse"
            >
              Loading Securely...
            </motion.h4>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
