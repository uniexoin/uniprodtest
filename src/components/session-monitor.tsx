'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function SessionMonitor() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // We only actively monitor if we have a sessionId to compare against.
    if (!user.sessionId) return;

    const channel = supabase
      .channel(`session-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload: any) => {
          const newSessionId = payload.new?.current_session_id;
          
          if (newSessionId && newSessionId !== user.sessionId) {
            console.warn('[SESSION MONITOR] Session overridden by another device!');
            setShowOverrideModal(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user?.id, user?.sessionId]);

  const handleAcknowledge = () => {
    setShowOverrideModal(false);
    logout();
    router.push('/login');
  };

  return (
    <AnimatePresence>
      {showOverrideModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Session Terminated</h2>
            <p className="text-sm text-muted-foreground mb-8">
              You have been logged out because your account was accessed from another device. 
              If this was not you, please reset your password immediately.
            </p>
            <button 
              onClick={handleAcknowledge}
              className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Acknowledge & Login
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
