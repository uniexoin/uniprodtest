'use client';

import { ArrowRight, CheckCircle2, Star, ShieldCheck, Car, Home, Shirt, ShoppingBag, Facebook, Instagram, Twitter, Youtube, Linkedin, Music2 } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const Step = ({ number, text }: { number: number; text: string }) => (
  <div className="flex items-start gap-5 mb-6 last:mb-0">
    <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#DCFF00] flex items-center justify-center text-[#0A0A0A] font-bold text-xs mt-1">
      {number}
    </div>
    <p className="text-[17px] leading-[1.55] text-[#E8E8E8]">{text}</p>
  </div>
);

const Divider = () => (
  <div className="py-8 flex justify-center">
    <div className="h-px w-24 bg-white/20" />
  </div>
);

const PrimaryButton = ({ label }: { label: string }) => (
  <button className="inline-flex items-center gap-3 bg-[#DCFF00] text-[#0A0A0A] font-bold rounded-lg px-6 py-3 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200">
    {label}
    <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
  </button>
);

const SolidButton = ({ label }: { label: string }) => (
  <button className="inline-block bg-white text-[#0A0A0A] font-bold rounded-lg px-8 py-3 hover:bg-[#E8E8E8] hover:-translate-y-0.5 transition-all duration-200">
    {label}
  </button>
);

const FooterLinkModal = ({ title, triggerText }: { title: string, triggerText: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="text-[12px] text-[#8F8E88] hover:text-white hover:underline transition-colors focus:outline-none">{triggerText}</button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-[#111111] text-[#F2F2F2] border-white/10">
      <DialogHeader>
        <DialogTitle className={`${instrumentSerif.className} text-3xl text-[#DCFF00]`}>{title}</DialogTitle>
        <DialogDescription className="text-[#8F8E88]">
          Content for {title} will be displayed here. This is a placeholder for the modal view requested.
        </DialogDescription>
      </DialogHeader>
      <div className="py-6">
        <p className="text-[#E8E8E8] leading-relaxed">
          Welcome to the UniExo {title} details. This information is loaded dynamically within the platform without leaving the page, ensuring a seamless user experience.
        </p>
      </div>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button variant="outline" className="border-[#DCFF00] text-[#DCFF00] hover:bg-[#DCFF00] hover:text-black">Close</Button>
        </DialogTrigger>
      </div>
    </DialogContent>
  </Dialog>
);

export default function MarketingLanding() {
  return (
    <div className="min-h-screen bg-[#050505] py-10 px-4 font-sans selection:bg-[#DCFF00] selection:text-black">
      <div className="max-w-[640px] mx-auto shadow-2xl overflow-hidden ring-1 ring-white/5 bg-[#111111] text-[#F2F2F2] rounded-xl">
        
        {/* Section 1 — Hero */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '640 / 820' }}>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
            src="https://cdn.pixabay.com/video/2023/10/22/186105-877202391_large.mp4" 
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(17,17,17,0) 45%, rgba(17,17,17,0.45) 68%, rgba(17,17,17,0.9) 88%, rgba(17,17,17,1) 100%)' }} />
          
          <div className="relative z-10 h-full flex flex-col items-center text-center px-6 pt-12 pb-10">
            <div className="flex flex-col items-center text-white">
              <span className={`${instrumentSerif.className} text-[32px] leading-[0.95] tracking-tight font-black`}>UniExo</span>
              <span className="text-[13px] tracking-[0.22em] font-medium mt-1">PLATFORM</span>
            </div>
            
            <div className="mt-40 mb-auto">
              <span className="text-white text-[13px] tracking-[0.28em] font-semibold border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm bg-black/30">NOW AVAILABLE</span>
            </div>
            
            <h1 className={`${instrumentSerif.className} text-white text-[58px] leading-[1.02] tracking-tight max-w-[560px] mb-4 drop-shadow-lg`}>
              Transform how you live on campus
            </h1>
            <p className="text-[#E8E8E8] text-lg font-medium drop-shadow-md">
              Vehicles, Rooms, Laundry & Marketplace.<br/>All in one unified hub.
            </p>
            
            <button className="mt-10 inline-flex items-center gap-3 bg-[#D8F90A] text-[#1E1E1E] font-semibold rounded-full px-8 py-4 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_0_30px_rgba(216,249,10,0.3)]">
              Explore Now
              <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* Section 2 — Intro copy */}
        <div className="px-8 md:px-[78px] pb-8 pt-8">
          <p className="text-center text-[18px] leading-[1.55] text-[#E8E8E8]">
            Built specifically for university students, UniExo gives you the ultimate toolkit to manage your campus life. From booking daily rides to securing your next PG, it's designed to save you time and eliminate the hassle of dealing with multiple unverified vendors.
          </p>
        </div>
        <div className="flex justify-center pb-14">
          <PrimaryButton label="Get Started" />
        </div>
        
        <Divider />

        {/* Section 3 — Transform */}
        <div className="px-6 md:px-9 pb-8 text-center">
          <h2 className={`${instrumentSerif.className} text-[46px] leading-[1.05] tracking-tight`}>
            Everything you need,<br/> instantly accessible
          </h2>
        </div>
        
        <div className="px-6 md:px-[42px] pb-10">
          <a href="#" className="block overflow-hidden rounded-[14px] group border border-white/10 shadow-xl">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-[370px] object-cover rounded-[14px] transition-transform duration-700 group-hover:scale-[1.03]"
              src="https://cdn.pixabay.com/video/2021/08/04/83896-584719460_large.mp4" 
            />
          </a>
        </div>
        
        <div className="px-6 md:px-[76px] pb-10">
          <div className="max-w-[489px] mx-auto">
            <Step number={1} text="Find verified PGs, hostels, and rooms instantly with transparent pricing and direct owner contacts." />
            <Step number={2} text="Rent premium vehicles, cars, and bikes with zero hassle and instant token bookings." />
            <Step number={3} text="Buy and sell second-hand items securely on our dedicated campus marketplace." />
            <Step number={4} text="Schedule automated laundry pickups and track your clothes right from your dorm." />
          </div>
        </div>
        
        <div className="flex justify-center pb-14">
          <SolidButton label="Join the Platform" />
        </div>
        
        <Divider />

        {/* Section 4 — Build your transformation roadmap */}
        <div className="px-6 md:px-9 pb-7 text-center">
          <h2 className={`${instrumentSerif.className} text-[46px] leading-[1.05] tracking-tight`}>
            Built for security<br/>and verified trust
          </h2>
        </div>
        
        <div className="px-6 md:px-[42px] pb-10">
          <a href="#" className="block overflow-hidden rounded-[14px] group border border-white/10 shadow-xl relative">
            <div className="absolute inset-0 bg-[#DCFF00]/10 mix-blend-overlay z-10" />
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-[370px] object-cover rounded-[14px] transition-transform duration-700 group-hover:scale-[1.03] grayscale contrast-125"
              src="https://cdn.pixabay.com/video/2019/01/17/20760-312019803_large.mp4" 
            />
          </a>
        </div>
        
        <div className="px-8 md:px-[78px] pb-8">
          <p className="text-center text-[18px] leading-[1.55] text-[#E8E8E8]">
            Every vendor on UniExo goes through strict KYC verification. Your payments are protected, your data is secure, and you have access to a support team dedicated to resolving your issues within minutes.
          </p>
        </div>
        
        <div className="flex justify-center pb-14">
          <SolidButton label="Learn More" />
        </div>

        {/* Section 5 — Lime CTA card */}
        <div className="px-6 md:px-14 pb-12">
          <div className="bg-[#D8F90A] rounded-[14px] px-8 py-14 text-center shadow-[0_20px_50px_rgba(216,249,10,0.15)]">
            <h2 className={`${instrumentSerif.className} text-[#1E1E1E] text-[48px] md:text-[52px] leading-[1.02] tracking-tight mb-4`}>
              Ready to upgrade<br/>your campus life?
            </h2>
            <p className="text-[#1E1E1E] text-[18px] leading-[1.5] mb-8 px-4 font-medium">
              Join thousands of students who have already switched to the ultimate multi-service platform.
            </p>
            <div className="flex justify-center">
              <PrimaryButton label="Create Free Account" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#080808] text-white pt-16 px-10 text-center border-t border-white/10">
          
          <div className="pb-10 flex justify-center">
            <a href="#" className={`${instrumentSerif.className} text-[36px] font-bold tracking-tight text-white hover:text-[#DCFF00] transition-colors flex items-center gap-1`}>
              Uni<span className="text-[#DCFF00]">Exo</span>
            </a>
          </div>

          <p className="text-[12px] text-[#83837D] leading-[1.5] pb-8 max-w-sm mx-auto">
            UniExo is the premier multi-service platform for universities. We connect students with verified local vendors for a seamless lifestyle experience.
          </p>

          <Divider />

          {/* Social Icons */}
          <div className="flex justify-center gap-4 pb-8">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#1E1E1E] hover:border-white transition-all duration-300">
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>

          <p className="text-[10px] text-[#83837D] pb-6 leading-[1.6]">
            If you no longer want to receive updates from UniExo Platform,
            you can unsubscribe at any time by clicking "unsubscribe" below.
          </p>

          {/* Dialog Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 pb-6">
            <FooterLinkModal title="Vehicles" triggerText="Vehicles" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <FooterLinkModal title="Rooms" triggerText="Rooms" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <FooterLinkModal title="Laundry" triggerText="Laundry" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <FooterLinkModal title="Support" triggerText="Help Center" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <FooterLinkModal title="Privacy Policy" triggerText="Privacy" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <FooterLinkModal title="Terms of Service" triggerText="Terms" />
            <span className="text-[#8F8E88] text-[10px]">|</span>
            <a href="#" className="text-[12px] text-[#8F8E88] hover:text-white hover:underline transition-colors focus:outline-none">Unsubscribe</a>
          </div>

          <a href="#" className="text-[12px] text-white/60 hover:text-white inline-block pb-10 transition-colors">
            ©2026 UniExo Inc, University Campus, IN 144411
          </a>
        </div>
        
      </div>
    </div>
  );
}
