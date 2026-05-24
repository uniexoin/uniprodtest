import { create } from 'zustand';
import { LanguageCode } from '@/lib/translations';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('uniexo-lang', lang);
    }
    set({ language: lang });
  },
}));
