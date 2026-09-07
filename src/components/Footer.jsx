import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1B3B2B] text-slate-300 py-5 px-6 text-xs border-t border-[#B89748]/30 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Copyright & System info */}
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B89748] animate-pulse"></span>
          <span>&copy; {currentYear} <span className="text-white font-bold tracking-wide">Attendance System</span>. All rights reserved.</span>
        </div>

        {/* Center/Right: Modern Creator Attribution & Tagline */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block text-slate-400 text-[11px]">Streamlined Session Tracking</span>
          
          <div className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 border border-[#B89748]/30 px-3 py-1.5 rounded-full transition-all duration-300 shadow-sm">
            <Sparkles size={13} className="text-[#B89748]" />
            <span className="text-slate-300">Created by</span>
            <span className="text-white font-bold tracking-wide text-amber-200">Samuel Ampah</span>
          </div>
        </div>

      </div>
    </footer>
  );
}