'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/language.store';
import { LANGUAGES, LanguageCode } from '@/lib/translations';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 text-white/80">
        <Globe className="w-4.5 h-4.5" />
      </Button>
    );
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code: LanguageCode) => {
    haptics.light();
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => {
          haptics.light();
          setIsOpen(!isOpen);
        }}
        variant="ghost"
        className="w-10 h-10 rounded-xl hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center p-0 gap-1 hover:scale-105 transition-all"
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-4.5 h-4.5" />
        <span className="text-[10px] font-black uppercase tracking-tighter ml-0.5">{currentLang.code}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d1b2ad9] dark:bg-[#121212d9] backdrop-blur-xl border border-white/10 dark:border-white/10 shadow-2xl p-1.5 z-[99999] overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-white/5 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Select Language</span>
              <span className="text-[9px] font-black text-accent bg-accent/15 px-2 py-0.5 rounded-full uppercase">Indian Dialects</span>
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all gap-2 hover:scale-[1.01] tap-feedback",
                    language === lang.code
                      ? "bg-accent text-primary"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-extrabold">{lang.nativeName}</span>
                      <span className={cn(
                        "text-[9px] font-medium leading-none",
                        language === lang.code ? "text-primary/70" : "text-white/40"
                      )}>
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {language === lang.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
