'use client';

import { useUIStore } from '@/store/ui.store';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function SuccessAnimationOverlay() {
  const { isSuccessOverlayOpen, successOverlayMessage } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSuccessOverlayOpen || typeof window === 'undefined' || !containerRef.current) return;
    
    let anim: any;
    import('lottie-web').then((lottieModule) => {
      anim = lottieModule.default.loadAnimation({
        container: containerRef.current!,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/success.json',
      });
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, [isSuccessOverlayOpen]);

  return (
    <AnimatePresence>
      {isSuccessOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl text-white"
        >
          <div className="max-w-md w-full p-8 text-center space-y-6">
            <div ref={containerRef} className="w-48 h-48 sm:w-64 sm:h-64 mx-auto max-w-full" />
            <motion.h3 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="text-2xl font-black uppercase tracking-tight text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
            >
              {successOverlayMessage}
            </motion.h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
