'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  Circle,
  X
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { haptics } from '@/lib/haptics';

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
      case 'kyc_update':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'danger':
      case 'payment_due':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBg = (type: Notification['type']) => {
    switch (type) {
      case 'success':
      case 'kyc_update':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'danger':
      case 'payment_due':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const NotificationList = ({ onClose }: { onClose: () => void }) => (
    <div className="theme-landing">
      <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-surface/50">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bell className="w-4 h-4" />
           </div>
           <div>
              <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Alerts</h4>
              <p className="text-[10px] text-muted-foreground font-bold">{unreadCount} UNREAD</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead.mutate()}
              className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-tighter"
            >
              READ ALL
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8 rounded-full text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[60vh] md:h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-16 h-16 rounded-3xl bg-surface border border-border flex items-center justify-center text-muted-foreground mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h5 className="text-sm font-black text-muted-foreground uppercase tracking-widest">No Alerts</h5>
            <p className="text-xs text-muted-foreground/60 mt-1 font-medium">No notifications at this time.</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification, idx) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !notification.isRead && markAsRead.mutate(notification._id)}
                className={`group relative p-4 rounded-2xl transition-all cursor-pointer mb-1 min-h-[72px] ${notification.isRead ? 'opacity-60' : 'bg-surface border border-border hover:border-primary/20 hover:bg-primary/5'}`}
              >
                <div className="flex gap-3 md:gap-4">
                  <div className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${getBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-sm font-black truncate ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                         <Circle className="w-2 h-2 fill-primary text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border bg-surface/50">
         <Button variant="ghost" className="w-full text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground" asChild onClick={onClose}>
            <Link href="/dashboard">View All Activity</Link>
         </Button>
      </div>
    </div>
  );

  const getBellButton = (isMobile: boolean) => (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={isMobile ? () => haptics.light() : undefined}
      className="relative w-10 h-10 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all flex items-center justify-center"
    >
      <Bell className={`w-4.5 h-4.5 md:w-5 md:h-5 ${unreadCount > 0 ? 'text-accent' : 'text-white/80 group-hover:text-white'}`} />
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 flex h-2.5 w-2.5 md:h-3 md:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-primary"></span>
        </span>
      )}
    </Button>
  );

  return (
    <>
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {getBellButton(false)}
          </PopoverTrigger>
          <PopoverContent className="w-[420px] p-0 glass-dark-lg rounded-[2rem] shadow-2xl overflow-hidden" align="end">
            <NotificationList onClose={() => setOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Sheet (Bottom Drawer) */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            {getBellButton(true)}
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0 glass-dark-lg rounded-t-[2rem] max-h-[85vh] overflow-hidden">
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-muted rounded-full opacity-50" />
            </div>
            <NotificationList onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
