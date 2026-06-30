'use client';

import { useAuthStore } from '@/modules/auth/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTakenDownModal() {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show if user is authenticated and the page_taken_down flag is true.
    // Also, don't show on the login page itself to allow them to actually log in and see the welcome animation first.
    if (_hasHydrated && isAuthenticated && user?.pageTakenDown) {
      if (!pathname?.startsWith('/login') && !pathname?.startsWith('/api')) {
        // Wait a short moment to ensure welcome animations or transitions have started/completed
        const timer = setTimeout(() => {
          setShow(true);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [isAuthenticated, user, _hasHydrated, pathname]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 selection:bg-primary/30"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
          className="relative max-w-lg w-full bg-zinc-900/80 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative z-10"
          >
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-playfair relative z-10 tracking-wide">
            Service Unavailable
          </h2>
          
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 relative z-10 font-medium">
            The page has been taken down due to non-payment of charges. We value your presence on our platform and would love to resolve this quickly.
          </p>

          <div className="bg-black/50 border border-zinc-800/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 group hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Kindly contact developer</p>
              <a 
                href="mailto:ashwinikumarkar16@gmail.com" 
                className="text-primary font-jetbrains text-sm md:text-base hover:underline font-semibold"
              >
                ashwinikumarkar16@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
