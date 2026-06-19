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
    <motion.div 
      className="group/card w-full bg-surface rounded-3xl border border-border/50 shadow-premium-soft hover-lift overflow-hidden flex flex-col relative focus-within:ring-2 focus-within:ring-ring"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex flex-col h-full">
        {/* ── Image Container ─────────────────────────────────── */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden shrink-0"
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
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all duration-200 shadow-sm relative z-10"
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background hover:bg-background shadow-md hover:scale-105 transition-transform"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background hover:bg-background shadow-md hover:scale-105 transition-transform"
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
                        ? 'w-[7px] h-[7px] bg-primary shadow-sm'
                        : 'w-[6px] h-[6px] bg-primary/40 hover:bg-primary/60'
                    )}
                    aria-label={`Go to image ${realIndex + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ── Text Content ────────────────────────────────────── */}
        <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-foreground truncate leading-tight">
              <Link href={href} className="before:absolute before:inset-0 z-0 focus:outline-none">
                {title}
              </Link>
            </h3>
            {secondaryInfo && (
              <p className="text-[14px] text-muted-foreground mt-1 truncate font-medium">
                {secondaryInfo}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-[15px] font-semibold text-foreground/90">
            <span className="truncate">
              ₹{formattedPrice} {subtitle ? <span className="text-sm font-normal text-muted-foreground">/ {subtitle}</span> : ''}
            </span>
            {rating !== undefined && rating > 0 && (
              <div className="flex items-center gap-1.5 shrink-0 bg-background px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold text-[13px] text-foreground">
                  {rating.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
