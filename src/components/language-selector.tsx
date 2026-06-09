'use client';

import React, { useEffect, useState } from 'react';

export function LanguageSelector() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If the script is already loaded and the init function exists, call it to re-render
    // when navigating between pages (since Next.js doesn't reload the page completely)
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      // Clear the element first just in case
      const el = document.getElementById('google_translate_element');
      if (el) el.innerHTML = '';
      
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      } catch (e) {
        console.error("Google Translate Init Error:", e);
      }
    }
  }, []);

  if (!mounted) {
    return <div className="w-[120px] h-9" />; // Placeholder to prevent layout shift
  }

  return (
    <div className="relative z-50 flex items-center">
      {/* 
        This div is targeted by the Google Translate script.
        We apply some basic styling to make it fit in the navbar.
      */}
      <div 
        id="google_translate_element" 
        className="overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      ></div>
    </div>
  );
}
