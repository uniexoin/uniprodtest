'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

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
  }, []);

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center theme-landing">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        
        {/* Lottie Animation */}
        <div ref={containerRef} className="w-48 h-48 relative z-10 mx-auto" />
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <h2 className="text-xs font-black tracking-[0.25em] text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse uppercase">
          Synchronizing Workspace...
        </h2>
      </div>
    </div>
  );
}
