'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Compass, SlidersHorizontal, LayoutGrid, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'uniexo_onboarding_done';

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  type: 'modal' | 'spotlight';
  buttonLabel: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Welcome to UniExo! 🎉',
    description:
      'Your campus marketplace for rooms, vehicles, laundry & more. Let us show you around!',
    type: 'modal',
    buttonLabel: 'Get Started',
  },
  {
    id: 'categories',
    icon: Compass,
    title: 'Browse by Category',
    description:
      'Use the navigation to explore vehicles, rooms, laundry services and marketplace.',
    type: 'spotlight',
    buttonLabel: 'Next',
  },
  {
    id: 'filters',
    icon: SlidersHorizontal,
    title: 'Smart Filters',
    description:
      'Use filters to narrow down exactly what you need. Filter by type, price, and availability.',
    type: 'spotlight',
    buttonLabel: 'Next',
  },
  {
    id: 'listings',
    icon: LayoutGrid,
    title: 'Explore Listings',
    description:
      'Tap any listing card to see details, photos, and book instantly.',
    type: 'spotlight',
    buttonLabel: 'Next',
  },
  {
    id: 'done',
    icon: Rocket,
    title: "You're all set! 🚀",
    description: 'Start exploring UniExo now. Happy browsing!',
    type: 'modal',
    buttonLabel: "Let's Go!",
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};



export function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Check if user recently registered or logged in (set via login/signup process)
    const pendingTrigger = localStorage.getItem('uniexo_trigger_onboarding');
    const done = localStorage.getItem(STORAGE_KEY);
    
    if (pendingTrigger === 'true' && !done) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const finish = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.removeItem('uniexo_trigger_onboarding');
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const next = useCallback(() => {
    if (currentStep === STEPS.length - 1) {
      finish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, finish]);

  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const isModal = step.type === 'modal';
  const totalSteps = STEPS.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={skip}
          />

          {/* Content */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isModal ? (
                /* ── Center Modal (Welcome / Done) ──────────────── */
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
                  exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
                  className="relative w-[90vw] max-w-md mx-auto"
                >
                  <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
                    {/* Decorative header gradient */}
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                    <div className="p-8 text-center">
                      {/* Icon */}
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                        <StepIcon className="w-8 h-8 text-primary" />
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-foreground mb-3">
                        {step.title}
                      </h2>

                      {/* Description */}
                      <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xs mx-auto mb-8">
                        {step.description}
                      </p>

                      {/* Progress dots */}
                      <div className="flex items-center justify-center gap-1.5 mb-6">
                        {STEPS.map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'rounded-full transition-all duration-300',
                              i === currentStep
                                ? 'w-6 h-2 bg-primary'
                                : i < currentStep
                                ? 'w-2 h-2 bg-primary/40'
                                : 'w-2 h-2 bg-muted-foreground/20'
                            )}
                          />
                        ))}
                      </div>

                      {/* Action button */}
                      <button
                        onClick={next}
                        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px] hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {step.buttonLabel}
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Skip link (not on last step) */}
                      {currentStep < totalSteps - 1 && (
                        <button
                          onClick={skip}
                          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Skip tour
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ── Spotlight Tooltip (Steps 2-4) ──────────────── */
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 280 } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  className="relative w-[90vw] max-w-sm mx-auto"
                >
                  <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
                    {/* Close / skip button */}
                    <button
                      onClick={skip}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-muted-foreground/10 hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                      aria-label="Skip onboarding"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    <div className="p-6">
                      {/* Step indicator */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <StepIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {currentStep + 1}/{totalSteps}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-foreground mb-1.5">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {step.description}
                      </p>

                      {/* Progress dots */}
                      <div className="flex items-center gap-1.5 mb-5">
                        {STEPS.map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'rounded-full transition-all duration-300',
                              i === currentStep
                                ? 'w-5 h-1.5 bg-primary'
                                : i < currentStep
                                ? 'w-1.5 h-1.5 bg-primary/40'
                                : 'w-1.5 h-1.5 bg-muted-foreground/20'
                            )}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={skip}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                          Skip
                        </button>
                        <button
                          onClick={next}
                          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 flex items-center gap-1.5"
                        >
                          {step.buttonLabel}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pointing arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-background border-l border-t border-border" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
