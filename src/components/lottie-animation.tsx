'use client';

import { useEffect, useRef } from 'react';

export function LottieAnimation({ 
  src, 
  loop = true, 
  autoplay = true,
  className = "" 
}: { 
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    import('lottie-web').then((lottieModule) => {
      if (!isMounted || !containerRef.current) return;
      
      // Clean up previous instance
      if (animRef.current) {
        animRef.current.destroy();
      }

      animRef.current = lottieModule.default.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        path: src,
      });
    });

    return () => {
      isMounted = false;
      if (animRef.current) {
        animRef.current.destroy();
      }
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}
