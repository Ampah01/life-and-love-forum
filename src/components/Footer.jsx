import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1B3B2B] text-slate-300 py-4 px-6 text-xs border-t border-[#B89748]/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="font-medium">
          &copy; {currentYear} <span className="text-white font-bold">Attendance System</span>. All rights reserved.
        </div>
        <div className="text-amber-200/80">
          Streamlined Session Tracking
        </div>
      </div>
    </footer>
  );
}