'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Facebook, Instagram, ChevronDown } from 'lucide-react';
import { LegalModal } from './legal-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { UniExoBrand } from './brand';
import { useAuthStore } from '@/store/auth.store';

export function Footer() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [legalModal, setLegalModal] = useState<{ open: boolean, title: string, content: React.ReactNode }>({
    open: false,
    title: '',
    content: null
  });
  const [serviceModal, setServiceModal] = useState<{ open: boolean, title: string, description: string, icon: string }>({
    open: false,
    title: '',
    description: '',
    icon: ''
  });
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  const isHiddenRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isHiddenRoute) return null;

  const openLegal = (title: string, content: React.ReactNode) => {
    setLegalModal({ open: true, title, content });
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleProductClick = (e: React.MouseEvent, label: string, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      let description = '';
      let icon = '';
      if (label === 'Vehicles') {
        description = "Explore our elite fleet of verified campus vehicles. Rent scooters, bicycles, and luxury cars from trusted campus owners with fully verified KYC, instant token booking, and absolute transaction protection. Drive safe, drive smart with UniExo.";
        icon = '🚗';
      } else if (label === 'Rooms') {
        description = "Find your home away from home. Discover verified PGs, single rooms, sharing suites, and campus apartments with zero brokerage, interactive video visits, live availability updates, and fully secure token reservation options.";
        icon = '🏠';
      } else if (label === 'Used Items') {
        description = "Your go-to campus peer-to-peer marketplace. Browse and purchase used books, laptops, electronics, furniture, and dorm essentials directly from fellow students. Integrated price negotiations, verified profiles, and secure local pickups.";
        icon = '🛍️';
      } else if (label === 'Laundry') {
        description = "Sleek, digital, and professional campus laundry. Schedule pickup and delivery slots per item or weight, track order status in real time, and pay securely online. Wash, dry, and fold with zero campus hassle.";
        icon = '🧺';
      }
      setServiceModal({
        open: true,
        title: label,
        description,
        icon
      });
    } else {
      router.push(href);
    }
  };

  const aboutContent = (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <p className="font-bold text-white">About UniExo Platform</p>
      <p>UniExo is India's leading unified multi-service ecosystem specifically optimized for university and college campuses. We bridge the gap between students, local vendors, and service partners to deliver verified peer-to-peer sharing and professional micro-services.</p>
      <h4 className="font-bold text-white">Our Vision</h4>
      <p>To eliminate resource waste, high commissions, and transaction friction on college campuses by offering a secure, verified, and community-trusted listing and booking system.</p>
      <h4 className="font-bold text-white">Core Pillars</h4>
      <p><strong>100% Verified Community:</strong> Only registered students and approved micro-businesses with active KYC are allowed to lease or rent on our hub.</p>
      <p><strong>Token Escrow Safety:</strong> Safeguard bookings using secure token protection, preventing scam listings and payment disputes.</p>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <p className="font-bold text-white">UniExo Comprehensive Privacy Policy</p>
      <p>Your trust is our highest priority. We deploy bank-grade encryption techniques to store, transmit, and process your platform interactions.</p>
      <h4 className="font-bold text-white">1. Information Gathering</h4>
      <p>We gather full names, university ID details, email addresses, phone contacts, service category definitions (for businesses), and device details to verify users and match orders securely.</p>
      <h4 className="font-bold text-white">2. KYC & Document Verification</h4>
      <p>Uploads of government IDs or university identification cards are processed strictly for verification. These documents are securely held in encrypted cloud databases and never shared.</p>
      <h4 className="font-bold text-white">3. Third Party Integrations</h4>
      <p>We work with trusted SMS gateways, payment APIs, and university checkups to authorize account operations. None of these partners are authorized to utilize your details for marketing purposes.</p>
    </div>
  );

  const termsContent = (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <p className="font-bold text-white">UniExo Comprehensive Terms of Service</p>
      <p>Welcome to UniExo. By utilizing our dashboard, applications, or site, you agree to comply with standard campus codes of conduct, local legislation, and these terms.</p>
      <h4 className="font-bold text-white">1. Eligible Users</h4>
      <p>Account creation is restricted to current college students, certified faculties, and verified vendor companies surrounding designated campuses.</p>
      <h4 className="font-bold text-white">2. Rental Safeguards</h4>
      <p>Lessees are solely responsible for matching vehicle conditions, key safety handovers, and return deadlines. Damages, late returns, or unpaid balances are subject to community penalties and reporting.</p>
      <h4 className="font-bold text-white">3. Platform Commissions</h4>
      <p>UniExo charges nominal service and maintenance fees for booking matching. These fees are detailed dynamically before checkout finalization.</p>
    </div>
  );

  const sections = [
    {
      id: 'product',
      title: 'Product',
      links: [
        { href: '/vehicles', label: 'Vehicles', onClick: (e: any) => handleProductClick(e, 'Vehicles', '/vehicles') },
        { href: '/houses', label: 'Rooms', onClick: (e: any) => handleProductClick(e, 'Rooms', '/houses') },
        { href: '/marketplace', label: 'Used Items', onClick: (e: any) => handleProductClick(e, 'Used Items', '/marketplace') },
        { href: '/laundry', label: 'Laundry', onClick: (e: any) => handleProductClick(e, 'Laundry', '/laundry') },
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { href: '#about', label: 'About Us', onClick: () => openLegal('About UniExo', aboutContent) },
        { href: '#privacy', label: 'Privacy Policy', onClick: () => openLegal('Privacy Policy', privacyContent) },
        { href: '#terms', label: 'Terms of Service', onClick: () => openLegal('Terms of Service', termsContent) },
      ]
    },
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { href: '/faqs', label: 'FAQs' },
        { href: '/help', label: 'Help Center' },
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden w-full mt-auto has-bottom-nav md:pb-0 theme-landing" style={{ background: 'linear-gradient(170deg, #0D1B2A 0%, #111827 60%, #0D1B2A 100%)' }}>
      
      {/* ── Decorative Background Elements ── */}
      {/* Gold glow orb top-left */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
      {/* Gold glow orb bottom-right */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-accent/8 rounded-full blur-[80px] pointer-events-none" />
      {/* Navy secondary glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Gold shimmer top border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="relative z-10 px-4 py-10 md:py-14 md:px-8">

        {/* Desktop: Full grid */}
        <div className="container mx-auto hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-5 inline-block">
              <UniExoBrand size="lg" />
            </Link>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              The platform for renting vehicles, rooms, buying used items, and finding laundry services.
            </p>
            {/* Animated gold accent bar */}
            <div className="mt-5 w-12 h-1 rounded-full bg-gradient-to-r from-accent to-accent/30 animate-pulse" />
          </div>

          {sections.map(section => (
            <div key={section.id}>
              <h3 className="font-bold text-accent/80 mb-4 text-[10px] uppercase tracking-[0.2em]">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    {(link as any).onClick ? (
                      <button onClick={(link as any).onClick} className="text-white/50 hover:text-accent transition-colors text-sm text-left">
                        {link.label}
                      </button>
                    ) : (
                      <Link href={link.href} className="text-white/50 hover:text-accent transition-colors text-sm">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-bold text-accent/80 mb-4 text-[10px] uppercase tracking-[0.2em]">Social</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://facebook.com" className="group flex items-center text-white/50 hover:text-accent transition-colors text-sm gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
                    <Facebook className="h-3.5 w-3.5" />
                  </div>
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="group flex items-center text-white/50 hover:text-accent transition-colors text-sm gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
                    <Instagram className="h-3.5 w-3.5" />
                  </div>
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile: Accordion layout */}
        <div className="md:hidden space-y-0">
          <Link href="/" className="mb-4 inline-block">
            <UniExoBrand size="md" />
          </Link>
          <p className="text-white/50 text-xs mb-6 max-w-[280px]">
            Rent vehicles, rooms, buy used items, and find laundry services.
          </p>

          {sections.map(section => (
            <div key={section.id} className="border-t border-white/10">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full py-3.5 text-left tap-feedback"
              >
                <span className="text-[10px] font-bold text-accent/70 uppercase tracking-[0.2em]">{section.title}</span>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${openSection === section.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-3 space-y-2.5 pl-1">
                      {section.links.map(link => (
                        <div key={link.label}>
                          {(link as any).onClick ? (
                            <button onClick={(link as any).onClick} className="text-white/50 hover:text-accent text-sm tap-feedback transition-colors">
                              {link.label}
                            </button>
                          ) : (
                            <Link href={link.href} className="text-white/50 hover:text-accent text-sm block tap-feedback transition-colors">{link.label}</Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Social links - horizontal on mobile */}
          <div className="border-t border-white/10 pt-4 flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Follow</span>
            <Link href="https://facebook.com" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all tap-feedback">
              <Facebook className="h-4 w-4 text-white/50" />
            </Link>
            <Link href="https://instagram.com" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all tap-feedback">
              <Instagram className="h-4 w-4 text-white/50" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Uniexo Platform. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_6px_rgba(201,168,76,0.6)]" />
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Powered by UniExo</span>
          </div>
        </div>
      </div>

      <LegalModal
        isOpen={legalModal.open}
        onClose={() => setLegalModal({ ...legalModal, open: false })}
        title={legalModal.title}
        content={legalModal.content}
      />

      <AnimatePresence>
        {serviceModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServiceModal({ ...serviceModal, open: false })}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/85 p-8 text-center shadow-2xl backdrop-blur-2xl"
            >
              {/* Top gold/burgundy glow decorative */}
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              <button 
                onClick={() => setServiceModal({ ...serviceModal, open: false })}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest font-black bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all">Close</span>
              </button>

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner">
                <span className="text-3xl">{serviceModal.icon}</span>
              </div>

              <h3 className="mb-4 text-2xl font-black uppercase tracking-tight text-white">
                UniExo <span className="text-accent">{serviceModal.title}</span>
              </h3>

              <p className="mb-8 text-sm leading-relaxed text-zinc-300">
                {serviceModal.description}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setServiceModal({ ...serviceModal, open: false });
                    router.push('/signup');
                  }}
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-accent/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Join UniExo
                </button>
                <button
                  onClick={() => {
                    setServiceModal({ ...serviceModal, open: false });
                    router.push('/login');
                  }}
                  className="w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all"
                >
                  Log In to Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
