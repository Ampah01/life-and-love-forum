import React from 'react';
import { LogOut } from 'lucide-react';

export default function UserNavBar({ user, onSignOut }) {
  return (
    <header className="bg-[#1B3B2B] text-white border-b-4 border-[#B89748] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Branding with contrasting logo container */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm border border-[#B89748]">
            <img 
              src="/logo.png" 
              alt="ICGC Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base tracking-wide leading-tight">
              ICGC Worship Temple Asonkore
            </h1>
            <p className="text-[10px] text-amber-200/90 font-medium tracking-wider uppercase">
              Life & Love Forum Portal
            </p>
          </div>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-100">
              {user?.email || 'Admin User'}
            </p>
            <p className="text-[10px] text-amber-200/80">Authorized Staff</p>
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs"
            title="Sign Out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
}