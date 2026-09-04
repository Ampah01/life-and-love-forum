import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-3">
          <div className="bg-[#1B3B2B]/10 p-3 rounded-full">
          <Loader2 className="w-8 h-8 text-[#1B3B2B] animate-spin" />
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-600">
          Loading session workspace...
        </div>
      </div>
    </div>
  );
}