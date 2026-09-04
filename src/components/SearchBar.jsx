import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  return (
    <div className="relative flex items-center w-full sm:w-80">
      <Search className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search all sessions & attendees..."
        className="w-full pl-9 pr-16 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent shadow-sm"
      />
      <button
        type="button"
        onClick={onSearch}
        className="absolute right-1 px-2.5 py-1 bg-[#1B3B2B] text-white text-[10px] font-semibold rounded-md hover:bg-[#142d21] transition"
      >
        Search
      </button>
    </div>
  );
}