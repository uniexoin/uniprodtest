'use client';

import { useUIStore } from '@/store/ui.store';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function SuccessAnimationOverlay() {
  const { isSuccessOverlayOpen, successOverlayMessage, successOverlayPath, successOverlayFullPage } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSuccessOverlayOpen || typeof window === 'undefined' || !containerRef.current) return;
    
    let anim: any;
    let isCancelled = false;

    // Clear previous contents to prevent overlaps
    containerRef.current.innerHTML = '';

    import('lottie-web').then((lottieModule) => {
      if (isCancelled) return;
      anim = lottieModule.default.loadAnimation({
        container: containerRef.current!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: successOverlayPath || '/success.json',
      });
    });

    return () => {
      isCancelled = true;
      if (anim) {
        anim.destroy();
      }
    };
  }, [isSuccessOverlayOpen, successOverlayPath]);

  return (
    <AnimatePresence>
      {isSuccessOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl text-white ${successOverlayFullPage ? 'bg-black' : ''}`}
        >
          <div className={`${successOverlayFullPage ? 'w-full h-full flex flex-col items-center justify-center' : 'max-w-md w-full p-8 text-center space-y-6'}`}>
            <div key={successOverlayPath} ref={containerRef} className={`${successOverlayFullPage ? 'w-full h-full max-w-2xl max-h-[80vh]' : 'w-48 h-48 sm:w-64 sm:h-64 mx-auto max-w-full'}`} />
            {successOverlayMessage && !successOverlayFullPage && (
              <motion.h3 
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="text-2xl font-black uppercase tracking-tight text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
              >
                {successOverlayMessage}
              </motion.h3>
            )}
            {successOverlayMessage && successOverlayFullPage && (
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-16 text-3xl md:text-4xl font-black uppercase tracking-widest text-white/90"
              >
                {successOverlayMessage}
              </motion.h3>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
