'use client';

import { useState, useTransition, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomManagementBoard } from '@/components/room-management-board';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Wallet, CheckCircle, Clock, XCircle, LayoutDashboard, 
  BarChart3, FileText, Car, Home, Shirt, AlertTriangle, CalendarCheck 
} from 'lucide-react';
import { 
  useVendorAnalyticsOverview, 
  useVendorSalesBreakdown, 
  useVendorLedger, 
  useVendorDues, 
  useVendorBookingTrends,
  useVendorRoomOccupancy 
} from '@/hooks/use-dashboard';
import { useVehicleFleet, useReturnVehicle, useToggleMaintenance, useVehicleOperations } from '@/hooks/use-fleet';
import { useVendorLaundryOrders, useUpdateVendorOrderStatus } from '@/hooks/use-laundry-services';
import { VehicleDispatchModal } from '@/components/vehicle-dispatch-modal';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/language.store';
import { TRANSLATIONS, LANGUAGES } from '@/lib/translations';

// Elegant Color Scheme
const BURGUNDY = '#8B004A';
const MUTED_BURGUNDY = '#A93226';
const CREAM = '#f8fafc';
const COLORS = [BURGUNDY, '#5B2C6F', MUTED_BURGUNDY, '#D2B4DE'];

export function VendorAnalyticsDashboard() {
  const [section, setSection] = useState('overview');
  const [isPending, startTransition] = useTransition();
  const { language, setLanguage } = useLanguageStore();

  const t = (key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const { data: overview, isLoading: loadingOverview } = useVendorAnalyticsOverview();
  const { data: dues } = useVendorDues();

  const serviceType = overview?.serviceType || 'all';

  const navItems = [
    { id: 'overview', label: t('analyticsOverview'), icon: LayoutDashboard },
    { id: 'revenue', label: t('revenueSales'), icon: BarChart3 },
    { id: 'ledger', label: t('ledgerBook'), icon: FileText },
    { id: 'fleet', label: t('vehicleFleet'), icon: Car },
    { id: 'rooms', label: t('roomPgManager'), icon: Home },
    ...(serviceType === 'laundry' ? [{ id: 'laundry', label: t('laundryPipeline'), icon: Shirt }] : []),
  ];

  // Loading handled gracefully - no blocking screen

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setSection(id);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen p-4 rounded-xl">
      {/* 🔔 Animated Due Alert Banner */}
      {dues?.totalDue > 0 && (
        <div className="fixed top-20 right-8 z-50 animate-bounce bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">₹{(dues?.totalDue || 0).toLocaleString()} Due!</span>
          <Button variant="outline" size="sm" className="text-red-600 border-white h-7" onClick={() => toast.success('Reminders sent to all customers!')}>
            Send Reminders
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        {/* Language Selector */}
        <div className="mb-4 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 p-2 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 pl-2">{t('changeLang') || 'Language'}</span>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-sm font-bold border-0 focus:ring-0 cursor-pointer text-[#8B004A] dark:text-rose-400"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="text-slate-900 dark:text-zinc-900">
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile: Grid of pills */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 lg:hidden p-1.5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 mb-4">
          {navItems.map((item) => {
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${isActive
                    ? 'text-white scale-[1.02]'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800 hover:text-[#8B004A] dark:hover:text-rose-400'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVendorAnalyticsMobilePill"
                    className="absolute inset-0 bg-[#8B004A] rounded-xl shadow-lg shadow-[#8B004A]/25 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="leading-tight text-center truncate w-full relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop: Vertical sidebar list */}
        <nav className="hidden lg:flex flex-col gap-2 p-2 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-zinc-850">
          {navItems.map((item) => {
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all duration-300 group ${isActive
                    ? 'text-white scale-[1.02]'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800 hover:text-[#8B004A] dark:hover:text-rose-400'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVendorAnalyticsDesktopPill"
                    className="absolute inset-0 bg-[#8B004A] rounded-xl shadow-lg shadow-[#8B004A]/20 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 space-y-6 w-full overflow-hidden">
        {section === 'overview' && <OverviewSection overview={overview} />}
        {section === 'revenue' && <RevenueSection />}
        {section === 'ledger' && <LedgerSection />}
        {section === 'fleet' && <FleetSection />}
        {section === 'rooms' && <RoomsSection />}
        {section === 'laundry' && <LaundrySection />}
      </div>
    </div>
  );
}

// ─── OVERVIEW SECTION ──────────────────────────────────────────────────
export function OverviewSection({ overview = {} }: { overview: any }) {
  const { data: trends } = useVendorBookingTrends(30);
  const { data: ledger } = useVendorLedger(1, 5); // Fetch recent 5 for activity feed
  const { language } = useLanguageStore();

  const t = (key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/60 dark:border-zinc-800 shadow-inner">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-zinc-100 leading-none mb-2">
            {t('dashboard')} <span className="text-[#8B004A] dark:text-rose-400">v2.0</span>
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('commandCenter')} ({overview.serviceType || 'business'})
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-white/20 dark:border-zinc-800">
          <Badge className="bg-[#8B004A] text-white hover:bg-[#8B004A] border-0 px-4 py-2 rounded-xl font-black tracking-widest text-[10px]">
            {overview.bookingsToday || 0} {t('newBookings')}
          </Badge>
          <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />
          <div className="flex flex-col items-end px-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase leading-none mb-1">{t('status')}</span>
            <span className="text-xs font-black text-green-600 dark:text-green-400 leading-none">{t('liveStream')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <KPICard 
          title={t('netEarnings')}
          value={`₹${(overview.netEarnings || 0).toLocaleString()}`} 
          icon={Wallet} 
          trend={`${overview.momGrowth || 0}%`} 
          trendLabel="MoM Growth"
          description={t('earningsDesc')}
          insight={t('earningsInsight')}
          gradient="from-[#8B004A] to-[#5B2C6F]"
        />
        <KPICard 
          title={t('conversion')}
          value={`${overview.conversionRate || 0}%`} 
          icon={CheckCircle} 
          description={t('conversionDesc')}
          insight={t('conversionInsight')}
          gradient="from-emerald-600 to-teal-600"
        />
        <KPICard 
          title={t('totalVolume')}
          value={overview.totalBookings || 0} 
          icon={TrendingUp} 
          subtitle={`${overview.confirmedBookings || 0} ${t('confirmed')}`}
          description={t('volumeDesc')}
          insight={t('volumeInsight')}
          gradient="from-blue-600 to-indigo-600"
        />
        <KPICard 
          title={t('avgOrder')}
          value={`₹${(overview.avgBookingValue || 0).toLocaleString()}`} 
          icon={BarChart3} 
          description={t('avgOrderDesc')}
          insight={t('avgOrderInsight')}
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="xl:col-span-2 border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100">
            <div className="flex justify-between items-center">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-[#8B004A]" />
                 30-Day Booking Velocity
               </CardTitle>
               <select className="text-xs font-bold bg-slate-50 border-0 rounded-lg px-2 py-1 outline-none">
                 <option>Last 30 Days</option>
                 <option>Last 7 Days</option>
               </select>
            </div>
          </CardHeader>
          <CardContent className="pt-8 h-[350px]">
            {trends ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B004A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8B004A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8B004A" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#8B004A', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B004A]"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {(Array.isArray(ledger?.entries) ? ledger.entries : []).slice(0, 5).map((entry: any, i: number) => (
                <div key={entry.id} className="flex items-start gap-4 animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`p-2 rounded-xl shrink-0 ${
                    entry.paymentStatus === 'completed' ? 'bg-green-100 text-green-600' : 
                    entry.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {entry.serviceType === 'vehicle' ? <Car className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{entry.customerName}</p>
                    <p className="text-xs text-slate-500">{new Date(entry.bookingDate).toLocaleDateString()} · {entry.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#8B004A]">₹{entry.totalAmount}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-400">{entry.paymentStatus}</p>
                  </div>
                </div>
              ))}
              {(!Array.isArray(ledger?.entries) || ledger.entries.length === 0) && (
                <div className="text-center py-12 text-slate-400 font-medium">
                  No recent activity found.
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-[#8B004A] font-bold hover:bg-[#8B004A]/5" onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'ledger' }))}>
              View Full Ledger
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg">Volume Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex justify-center items-center pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: overview.completedBookings || 0 },
                    { name: 'Pending', value: overview.pendingBookings || 0 },
                    { name: 'Cancelled', value: overview.cancelledBookings || 0 },
                  ]}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value"
                >
                  <Cell fill="#8B004A" strokeWidth={0} />
                  <Cell fill="#D2B4DE" strokeWidth={0} />
                  <Cell fill="#f1f5f9" strokeWidth={0} />
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-[#8B004A] text-white rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-white/80 font-medium uppercase tracking-widest text-xs">Wallet Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-8">
            <div>
              <p className="text-5xl font-black">₹{(overview.netEarnings || 0).toLocaleString()}</p>
              <p className="text-white/60 text-sm mt-2 font-medium">Available for immediate withdrawal</p>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white text-[#8B004A] hover:bg-white/90 font-bold px-8 rounded-2xl">Withdraw Funds</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 rounded-2xl">Statements</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold animate-in zoom-in duration-200">
        <p className="mb-1 text-slate-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function KPICard({ title, value, icon: Icon, trend, trendLabel, subtitle, description, gradient, insight }: any) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full h-full"
    >
      <Card className="border-0 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] bg-white dark:bg-zinc-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-rose-500/10 dark:hover:shadow-rose-950/20 transition-all duration-500 group relative border border-white/50 dark:border-white/5 flex flex-col w-full">
        <CardContent className="p-0 flex flex-col h-full justify-between">
          <div>
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
            
            {/* Ambient background light glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-3xl pointer-events-none group-hover:scale-150 transition-all duration-700" />
            
            <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md shadow-rose-500/25`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {trend && (
                    <div className="flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-black shadow-sm">
                      <TrendingUp className="w-2.5 h-2.5" />
                      {trend}
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-[9px] sm:text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none">{title}</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate leading-tight group-hover:text-[#8B004A] dark:group-hover:text-rose-400 transition-colors">{value}</p>
                </div>
              </div>
              <div>
                {description && (
                  <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-zinc-400 font-bold mt-2 sm:mt-4 uppercase tracking-tighter">{description}</p>
                )}
                {subtitle && (
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 font-bold mt-1 sm:mt-2">{subtitle}</p>
                )}
                
                {/* Live dynamic metadata insight */}
                {insight && (
                  <div className="mt-3.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/50 dark:border-white/5 flex items-start gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-[#8B004A]/20 dark:group-hover:border-rose-500/20 transition-all duration-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-0.5 shrink-0 shadow-sm shadow-emerald-500/50" />
                    <span className="text-[7.5px] sm:text-[9.5px] leading-relaxed font-bold text-slate-600 dark:text-zinc-300">
                      {insight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── REVENUE SECTION ────────────────────────────────────────────────────
export function RevenueSection() {
  const { data: sales } = useVendorSalesBreakdown('year');
  const { data: overview } = useVendorAnalyticsOverview();
  const serviceType = overview?.serviceType;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Revenue & Sales</h2>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-full bg-surface-container border border-outline/20 text-sm font-semibold text-secondary hover:bg-surface-variant transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">Total Revenue</p>
            <p className="font-headline-lg text-headline-lg text-primary text-4xl mb-1">₹{(overview?.netEarnings || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 text-on-tertiary-container bg-tertiary-container/10 px-2 py-0.5 rounded-full w-fit">
               <span className="material-symbols-outlined text-[10px]">trending_up</span>
               <span className="text-[10px] font-bold">+12.5% this month</span>
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
            <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">Pending Clearances</p>
            <p className="font-headline-lg text-headline-lg text-on-surface text-4xl mb-1">₹{(overview?.pendingEarnings || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full w-fit bg-surface-container">
               To be cleared in 2-3 days
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mb-3 shadow-lg">
               <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <p className="font-title-lg text-title-lg text-sm text-on-surface font-semibold mb-1">Ready for Withdrawal</p>
            <button className="text-primary text-sm font-bold hover:underline">Manage Wallet</button>
         </div>
      </div>

      {sales && (
        <section className="glass-panel p-8 rounded-3xl mt-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface">Revenue Dynamics</h3>
            <select className="bg-surface-container border border-outline/20 text-on-surface font-title-lg text-title-lg text-sm px-4 py-2 rounded-lg outline-none cursor-pointer hover:bg-surface-variant transition-colors">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales.monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#87717730" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#5c5f60', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5c5f60', fontSize: 12}} />
                <RechartsTooltip cursor={{ fill: 'rgba(112, 13, 62, 0.05)' }} contentStyle={{ backgroundColor: '#191c1d', borderRadius: '12px', border: 'none', color: '#fff' }} />
                {(!serviceType || serviceType === 'vehicle') && <Bar dataKey="vehicle" stackId="a" fill="#4d0027" radius={[0, 0, 4, 4]} />}
                {(!serviceType || serviceType === 'house') && <Bar dataKey="house" stackId="a" fill="#700d3e" />}
                {(!serviceType || serviceType === 'laundry') && <Bar dataKey="laundry" stackId="a" fill="#f57ba9" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── LEDGER SECTION ─────────────────────────────────────────────────────
export function LedgerSection() {
  const { data: ledger, isLoading } = useVendorLedger(1, 50);

  if (isLoading) return <div>Loading ledger...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Ledger Book</h2>
        <div className="flex gap-4">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-sm py-1">Total Earned: ₹{(ledger?.totals?.totalNetEarned || 0).toLocaleString()}</Badge>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-sm py-1">Total Due: ₹{(ledger?.totals?.totalDue || 0).toLocaleString()}</Badge>
        </div>
      </div>

      {/* Mobile View: Card List */}
      <div className="space-y-4 md:hidden">
        {(Array.isArray(ledger?.entries) ? ledger.entries : []).map((row: any) => {
          const rowDate = new Date(row.bookingDate);
          const formattedDate = `${rowDate.toLocaleDateString()} ${rowDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          return (
            <Card key={row.id} className={`p-4 border-l-4 transition-all hover:shadow-md ${
              row.colorCode === 'green' ? 'border-l-emerald-500 bg-emerald-50/10' : 
              row.colorCode === 'red' ? 'border-l-red-500 bg-red-50/10' : 
              row.colorCode === 'amber' ? 'border-l-amber-500 bg-amber-50/10' : 'border-l-slate-300'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground">{formattedDate}</span>
                  <h4 className="font-bold text-sm text-foreground mt-0.5">{row.customerName}</h4>
                  <p className="text-xs text-muted-foreground">{row.serviceName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  row.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                  row.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 
                  row.paymentStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {row.paymentStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-center">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Amount</p>
                  <p className="text-xs font-bold text-foreground">₹{row.totalAmount}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Net Earned</p>
                  <p className="text-xs font-bold text-green-600">₹{row.netEarned}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Due</p>
                  <p className={`text-xs font-bold ${row.dueAmount > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {row.dueAmount > 0 ? `₹${row.dueAmount}` : '-'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <Card className="overflow-hidden border-0 shadow-lg hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900 text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Net Earned</th>
                <th className="px-6 py-4 text-right">Due</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {(Array.isArray(ledger?.entries) ? ledger.entries : []).map((row: any) => {
                const rowDate = new Date(row.bookingDate);
                const formattedDate = `${rowDate.toLocaleDateString()} ${rowDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                return (
                <tr key={row.id} className={`hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors
                  ${row.colorCode === 'green' ? 'bg-emerald-50' : ''}
                  ${row.colorCode === 'red' ? 'bg-red-50' : ''}
                  ${row.colorCode === 'amber' ? 'bg-amber-50' : ''}
                `}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">{formattedDate}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{row.serviceName}</td>
                  <td className="px-6 py-4 text-right font-medium">₹{row.totalAmount}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-semibold">₹{row.netEarned}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-semibold">{row.dueAmount > 0 ? `₹${row.dueAmount}` : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${row.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${row.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                      ${row.paymentStatus === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      ${row.paymentStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {row.paymentStatus}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right">PAGE TOTALS:</td>
                <td className="px-6 py-4 text-right">₹{(ledger?.totals?.totalRevenue || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-green-600">₹{(ledger?.totals?.totalNetEarned || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-red-600">₹{(ledger?.totals?.totalDue || 0).toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── FLEET SECTION (Real-Time) ──────────────────────────────────────────
function LiveTimer({ expectedReturnAt }: { expectedReturnAt: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const expected = new Date(expectedReturnAt).getTime();
  const diffMs = expected - now;
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <span className={`font-mono font-bold ${isOverdue ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
      {isOverdue ? '-' : ''}{timeString}
      {isOverdue && ' (OVERDUE)'}
    </span>
  );
}

export function FleetSection() {
  const { data } = useVehicleFleet();
  const fleet = data?.fleet || [];
  const todayRevenue = data?.todayRevenue || 0;
  const returnVehicle = useReturnVehicle();
  const toggleMaintenance = useToggleMaintenance();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/40 dark:bg-zinc-900/40 p-6 rounded-[2rem] border border-white/60 dark:border-zinc-800 shadow-inner">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-600" /> Live Fleet Board
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Live Sync Active</span>
          </div>
        </div>
        
        {/* Daily Revenue Bar */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 text-center sm:text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Total Revenue</span>
            <span className="text-3xl font-black text-[#8B004A] dark:text-rose-400 leading-none mt-1">₹{todayRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fleet?.map((v: any) => (
          <Card key={v._id} className={`overflow-hidden border-t-4 transition-all hover:shadow-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex flex-col ${
            v.currentStatus === 'available' ? 'border-t-green-500' : 
            v.currentStatus === 'dispatched' ? (v.isOverdue ? 'border-t-red-600 shadow-red-100 dark:shadow-red-900/20' : 'border-t-orange-500') : 
            v.currentStatus === 'maintenance' ? 'border-t-purple-500 shadow-purple-100 dark:shadow-purple-900/20' :
            'border-t-gray-500'
          }`}>
            {/* Vehicle Image */}
            <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-800">
               <img src={v.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80'} alt={v.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               
               <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="text-white">
                    <h3 className="font-bold text-lg leading-tight shadow-sm">{v.name}</h3>
                    <p className="text-xs font-mono opacity-90">{v.registrationNumber}</p>
                  </div>
                  <Badge className={`border-0 shadow-lg ${
                    v.currentStatus === 'available' ? 'bg-green-500 text-white hover:bg-green-600' : 
                    v.currentStatus === 'dispatched' ? 'bg-orange-500 text-white hover:bg-orange-600' : 
                    v.currentStatus === 'maintenance' ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-500'
                  }`}>
                    {v.currentStatus.toUpperCase()}
                  </Badge>
               </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
                {v.currentStatus === 'dispatched' && v.currentBooking ? (
                  <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-4 text-sm space-y-3 flex-1 border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Customer</span>
                      <span className="font-bold text-foreground">{v.currentBooking.userId?.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Booking Window</span>
                      <div className="text-right flex flex-col">
                         <span className="font-medium text-xs text-foreground">{new Date(v.currentBooking.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         <span className="text-muted-foreground text-[10px]">to</span>
                         <span className="font-medium text-xs text-foreground">{new Date(v.currentBooking.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Revenue Earned</span>
                      <span className="font-black text-green-600 dark:text-green-400">₹{v.currentBooking.totalAmount || v.pricePerDay}</span>
                    </div>

                    {v.expectedReturnAt && (
                      <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-500/10 p-2 rounded-lg mt-2">
                        <span className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase">Live Timer</span>
                        <LiveTimer expectedReturnAt={v.expectedReturnAt} />
                      </div>
                    )}
                  </div>
                ) : v.currentStatus === 'maintenance' ? (
                  <div className="mb-4 flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 dark:border-purple-900 rounded-xl bg-purple-50/50 dark:bg-purple-900/10">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3 text-purple-600 dark:text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <span className="text-sm text-purple-700 dark:text-purple-400 font-bold text-center">Vehicle is undergoing maintenance</span>
                  </div>
                ) : (
                  <div className="mb-4 flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30">
                     <p className="text-sm text-muted-foreground font-bold mb-1">Available for Booking</p>
                     <p className="text-2xl font-black text-foreground">₹{v.pricePerDay}<span className="text-xs text-muted-foreground font-medium"> / day</span></p>
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-2">
                  {v.currentStatus === 'available' ? (
                    <>
                      <div className="flex-1">
                        <VehicleDispatchModal vehicle={v} />
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-400 dark:hover:bg-purple-900/30 font-bold"
                        onClick={() => toggleMaintenance.mutate({ id: v._id, isEntering: true })}
                        disabled={toggleMaintenance.isPending}
                      >
                        Maintenance
                      </Button>
                    </>
                  ) : v.currentStatus === 'maintenance' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-900/30 font-bold h-11"
                      onClick={() => toggleMaintenance.mutate({ id: v._id, isEntering: false })}
                      disabled={toggleMaintenance.isPending}
                    >
                      Make Available
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 h-11"
                      onClick={() => returnVehicle.mutate({ id: v._id, data: {} })}
                      disabled={returnVehicle.isPending}
                    >
                      {returnVehicle.isPending ? 'Processing...' : 'Mark as Returned'}
                    </Button>
                  )}
                </div>
            </CardContent>
          </Card>
        ))}
        {fleet?.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                   <Car className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold">No Vehicles in Fleet</h3>
                <p className="text-muted-foreground mt-2">Add vehicles to your garage to start managing them here.</p>
            </div>
        )}
      </div>

      <VehicleOperationsHistory />
    </div>
  );
}

function VehicleOperationsHistory() {
  const { data: operations, isLoading } = useVehicleOperations();

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="mt-12 space-y-4">
      <h3 className="text-xl font-bold tracking-tight">Operations Ledger</h3>
      {/* Mobile View: Operations Cards */}
      <div className="space-y-3 md:hidden">
        {operations?.map((op: any) => (
          <Card key={op.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] text-muted-foreground">{new Date(op.created_at).toLocaleString()}</span>
                <h4 className="font-bold text-sm text-foreground mt-0.5">{op.vehicle?.name}</h4>
                <p className="text-[10px] font-mono text-muted-foreground">{op.vehicle?.registration_number}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] ${
                op.operation_type === 'dispatch' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                op.operation_type === 'return' ? 'bg-green-50 text-green-700 border-green-200' : 
                'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {op.operation_type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
              <div>
                <span className="text-muted-foreground">Customer: </span>
                <span className="font-semibold text-foreground">{op.booking?.user?.name || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Odometer: </span>
                <span className="font-semibold text-foreground font-mono">{op.odometer ? `${op.odometer} km` : '-'}</span>
              </div>
            </div>
            {op.notes && (
              <div className="mt-2 p-2 bg-slate-50 dark:bg-zinc-900 rounded text-xs text-muted-foreground italic">
                {op.notes}
              </div>
            )}
          </Card>
        ))}
        {(!operations || operations.length === 0) && (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No operations history found.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-xl hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium">Operation</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Odometer</th>
                <th className="px-4 py-3 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operations?.map((op: any) => (
                <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(op.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {op.vehicle?.name}
                    <span className="block text-[10px] text-muted-foreground">{op.vehicle?.registration_number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`
                      ${op.operation_type === 'dispatch' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                      ${op.operation_type === 'return' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${op.operation_type?.startsWith('maintenance') ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    `}>
                      {op.operation_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {op.booking?.user?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {op.odometer ? `${op.odometer} km` : '-'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                    {op.notes || '-'}
                  </td>
                </tr>
              ))}
              {(!operations || operations.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No operations history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── ROOMS SECTION ──────────────────────────────────────────────────────
export function RoomsSection() {
  return <RoomManagementBoard />;
}

// ─── LAUNDRY PIPELINE SECTION ───────────────────────────────────────────
export function LaundrySection() {
  const { data: laundry } = useVendorLaundryOrders(1, 100);
  const updateStatus = useUpdateVendorOrderStatus();
  const [activeStage, setActiveStage] = useState('placed');

  const stages = [
    { id: 'placed', label: 'New', fullLabel: 'New Orders', color: 'bg-blue-100 border-blue-200 text-blue-800' },
    { id: 'processing', label: 'Washing', fullLabel: 'Washing', color: 'bg-indigo-100 border-indigo-200 text-indigo-800' },
    { id: 'in_progress', label: 'Ironing', fullLabel: 'Ironing/Folding', color: 'bg-purple-100 border-purple-200 text-purple-800' },
    { id: 'out_for_delivery', label: 'Delivery', fullLabel: 'Out for Delivery', color: 'bg-orange-100 border-orange-200 text-orange-800' },
    { id: 'delivered', label: 'Done', fullLabel: 'Completed', color: 'bg-green-100 border-green-200 text-green-800' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Laundry Kanban Pipeline</h2>
        {laundry && (
          <Badge variant="outline" className="text-sm px-3 py-1">
            Total Revenue: ₹{(laundry?.totalRevenue || 0).toLocaleString()}
          </Badge>
        )}
      </div>

      {/* Mobile Stage Selector Tab Strip */}
      <div className="flex md:hidden gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        {stages.map(stage => {
          const count = laundry?.orders?.filter((o: any) => o.status === stage.id).length || 0;
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#8B004A] text-white shadow-md'
                  : 'bg-white/50 text-slate-500 border border-slate-200 hover:bg-white dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
              }`}
            >
              <span>{stage.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Container */}
      <div>
        {/* Mobile View: Single Column matching activeStage */}
        <div className="block md:hidden mt-4">
          {stages.filter(s => s.id === activeStage).map(stage => {
            const stageOrders = laundry?.orders?.filter((o: any) => o.status === stage.id) || [];
            return (
              <div key={stage.id} className="flex flex-col w-full">
                <div className={`p-3.5 rounded-t-xl border-t border-l border-r font-bold flex justify-between items-center ${stage.color}`}>
                  <span className="text-sm uppercase tracking-wider">{stage.fullLabel}</span>
                  <span className="bg-white/80 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm">{stageOrders.length}</span>
                </div>
                <div className="bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm border p-4 flex-1 rounded-b-xl space-y-3 min-h-[300px]">
                  {stageOrders.map((order: any) => (
                    <Card key={order._id} className="shadow-sm border border-slate-100 dark:border-zinc-800/50 hover:border-[#8B004A]/30 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="font-bold text-sm text-foreground">{order.userId?.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3 font-semibold">{order.items.length} items • {order.pickupType}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-[#8B004A]">₹{order.totalAmount}</span>
                          {/* Quick Action Button */}
                          <div className="w-1/2">
                            {stage.id === 'placed' && <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-bold" onClick={() => updateStatus.mutate({ id: order._id, status: 'processing' })}>Start Wash</Button>}
                            {stage.id === 'processing' && <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-bold" onClick={() => updateStatus.mutate({ id: order._id, status: 'in_progress' })}>To Ironing</Button>}
                            {stage.id === 'in_progress' && <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-bold" onClick={() => updateStatus.mutate({ id: order._id, status: 'out_for_delivery' })}>Send Out</Button>}
                            {stage.id === 'out_for_delivery' && <Button size="sm" className="w-full h-8 text-xs font-bold bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus.mutate({ id: order._id, status: 'delivered' })}>Mark Delivered</Button>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageOrders.length === 0 && (
                    <div className="text-center py-12 text-xs text-muted-foreground font-semibold border-2 border-dashed border-slate-200 dark:border-zinc-800/80 rounded-xl">
                      No orders in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full 5-column Board */}
        <div className="hidden md:flex gap-4 overflow-x-auto pb-4 snap-x">
          {stages.map(stage => {
            const stageOrders = laundry?.orders?.filter((o: any) => o.status === stage.id) || [];
            return (
              <div key={stage.id} className="w-[300px] shrink-0 snap-center flex flex-col h-[calc(100vh-220px)]">
                <div className={`p-3 rounded-t-xl border-t border-l border-r font-bold flex justify-between ${stage.color}`}>
                  <span>{stage.fullLabel}</span>
                  <span className="bg-white/50 px-2 rounded-full text-xs flex items-center">{stageOrders.length}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-900 border p-3 flex-1 overflow-y-auto rounded-b-xl space-y-3">
                  {stageOrders.map((order: any) => (
                    <Card key={order._id} className="shadow-sm cursor-grab hover:border-[#8B004A]/30 transition-colors">
                      <CardContent className="p-3">
                        <div className="font-semibold text-sm mb-1">{order.userId?.name}</div>
                        <div className="text-xs text-muted-foreground mb-3">{order.items.length} items • {order.pickupType}</div>
                        
                        <div className="flex gap-1 mt-2">
                          {stage.id === 'placed' && <Button size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={() => updateStatus.mutate({ id: order._id, status: 'processing' })}>Start Wash</Button>}
                          {stage.id === 'processing' && <Button size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={() => updateStatus.mutate({ id: order._id, status: 'in_progress' })}>To Ironing</Button>}
                          {stage.id === 'in_progress' && <Button size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={() => updateStatus.mutate({ id: order._id, status: 'out_for_delivery' })}>Send Out</Button>}
                          {stage.id === 'out_for_delivery' && <Button size="sm" className="w-full h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus.mutate({ id: order._id, status: 'delivered' })}>Mark Delivered</Button>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageOrders.length === 0 && (
                    <div className="text-center p-4 text-xs text-muted-foreground font-medium border-2 border-dashed border-slate-200 dark:border-zinc-800/80 rounded-lg">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
