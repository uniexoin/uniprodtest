'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AirbnbListingCardProps {
  id: string;
  title: string;
  subtitle?: string;
  secondaryInfo?: string;
  images: string[];
  price: number;
  priceUnit?: string;
  rating?: number;
  badge?: string;
  badgeVariant?: 'primary' | 'accent' | 'success' | 'default';
  href: string;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

const badgeColors: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  success: 'bg-emerald-600 text-white dark:bg-emerald-500',
  default: 'bg-foreground text-background',
};

export function AirbnbListingCard({
  id,
  title,
  subtitle,
  secondaryInfo,
  images,
  price,
  priceUnit = 'month',
  rating,
  badge,
  badgeVariant = 'default',
  href,
  isFavorited = false,
  onFavoriteToggle,
}: AirbnbListingCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const hasMultipleImages = images.length > 1;

  const goToPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDirection(-1);
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  const goToNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDirection(1);
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFavorited((prev) => !prev);
      onFavoriteToggle?.();
    },
    [onFavoriteToggle]
  );

  const handleDotClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setDirection(1);
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
        } else {
          setDirection(-1);
          setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          );
        }
      }
      touchStartX.current = null;
    },
    [images.length]
  );

  const formattedPrice = new Intl.NumberFormat('en-IN').format(price);

  // Show max 5 dots, centered around current
  const maxDots = 5;
  const totalImages = images.length;
  let dotStart = 0;
  let dotEnd = totalImages;
  if (totalImages > maxDots) {
    dotStart = Math.max(0, currentIndex - Math.floor(maxDots / 2));
    dotEnd = dotStart + maxDots;
    if (dotEnd > totalImages) {
      dotEnd = totalImages;
      dotStart = dotEnd - maxDots;
    }
  }
  const visibleDots = images.slice(dotStart, dotEnd);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0.5,
    }),
  };

  return (
    <div className="group/card w-full">
      <Link href={href} className="block">
        {/* ── Image Container ─────────────────────────────────── */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Carousel */}
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={`${id}-${currentIndex}`}
                src={images[currentIndex] || '/placeholder.svg'}
                alt={`${title} - image ${currentIndex + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>

          {/* Heart / Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors duration-200',
                favorited
                  ? 'fill-red-500 text-red-500'
                  : 'fill-black/40 text-black/60 hover:text-black'
              )}
            />
          </button>

          {/* Badge */}
          {badge && (
            <span
              className={cn(
                'absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide shadow-sm',
                badgeColors[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}

          {/* Arrow Buttons — visible on hover only */}
          {hasMultipleImages && (
            <>
              <AnimatePresence>
                {isHovering && currentIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-white shadow-md hover:scale-105 transition-transform"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-black/80" />
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isHovering && currentIndex < images.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-white shadow-md hover:scale-105 transition-transform"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-black/80" />
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Dot Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {visibleDots.map((_, i) => {
                const realIndex = dotStart + i;
                return (
                  <button
                    key={realIndex}
                    onClick={(e) => handleDotClick(e, realIndex)}
                    className={cn(
                      'rounded-full transition-all duration-200',
                      realIndex === currentIndex
                        ? 'w-[7px] h-[7px] bg-white shadow-sm'
                        : 'w-[6px] h-[6px] bg-white/60 hover:bg-white/80'
                    )}
                    aria-label={`Go to image ${realIndex + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ── Text Content ────────────────────────────────────── */}
        <div className="mt-3">
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-zinc-100 truncate leading-tight">
            {title}
          </h3>
          {secondaryInfo && (
            <p className="text-[14px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
              {secondaryInfo}
            </p>
          )}
          
          <div className="flex items-center gap-1.5 mt-1 text-[14px] text-slate-600 dark:text-zinc-400">
            <span className="truncate">
              ₹{formattedPrice} {subtitle ? `for ${subtitle}` : ''}
            </span>
            {rating !== undefined && rating > 0 && (
              <>
                <span className="text-slate-400 dark:text-zinc-600">•</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900 dark:fill-zinc-300 dark:text-zinc-300" />
                  <span className="font-medium text-slate-900 dark:text-zinc-300">
                    {rating.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
