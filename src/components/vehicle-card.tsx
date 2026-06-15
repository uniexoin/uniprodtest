import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, User, Droplet, Gauge, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VehicleCardProps {
  id: string;
  title: string;
  images: string[];
  pricePerDay: number;
  rating?: number;
  seatingCapacity: number;
  fuelType: string;
  kmsOrSpeed?: number;
  isAvailable?: boolean;
  href: string;
}

export function VehicleCard({
  id,
  title,
  images,
  pricePerDay,
  rating = 0,
  seatingCapacity,
  fuelType,
  kmsOrSpeed = 0,
  isAvailable = true,
  href,
}: VehicleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited((prev) => !prev);
  }, []);

  return (
    <Link href={href} className="block w-[280px] shrink-0">
      <motion.div 
        className="flex flex-col gap-3"
        whileTap={{ scale: 0.98 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full rounded-[1.2rem] overflow-hidden bg-surface shadow-sm border border-border">
          <img 
            src={images[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80'} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
          
          {/* Available Badge */}
          {isAvailable && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#22c55e] text-accent-foreground px-2.5 py-1 rounded-full shadow-md">
              <Check className="w-3 h-3 stroke-[3]" />
              <span className="text-[11px] font-bold tracking-wide">Available</span>
            </div>
          )}
          
          {/* Heart Button */}
          <button 
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/20"
          >
            <Heart className={cn("w-4 h-4", isFavorited ? "fill-white text-accent-foreground" : "text-accent-foreground")} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 px-1">
          {/* Title & Rating */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground truncate">{title}</h3>
            <div className="flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md border border-green-500/20">
              <span className="text-[12px] font-bold">★ {rating}</span>
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 bg-surface/80 px-2.5 py-1.5 rounded-lg border border-border/50">
              <User className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-semibold text-foreground/80">{seatingCapacity}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface/80 px-2.5 py-1.5 rounded-lg border border-border/50">
              <Droplet className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-semibold text-foreground/80">{fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface/80 px-2.5 py-1.5 rounded-lg border border-border/50">
              <Gauge className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-semibold text-foreground/80">{kmsOrSpeed}</span>
            </div>
          </div>

          {/* Price Tag */}
          <div className="mt-2 inline-flex bg-accent text-accent-foreground px-3 py-1.5 rounded-lg self-start shadow-md">
            <span className="text-[13px] font-black tracking-wide">₹{pricePerDay}/day</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
