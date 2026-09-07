import React from 'react';
import { MapPin, Clock, UserCheck, UserPlus, ArrowRight } from 'lucide-react';

export default function StatsCards({ attendees = [], newMembers = [], onFilterNewMembers }) {
  // Filter only attendees who have been confirmed as present
  const confirmedAttendees = attendees.filter((att) => att.attended === true);
  const confirmedCount = confirmedAttendees.length;
  const totalRegistered = attendees.length;
  const newMembersCount = newMembers.length;

  // Optimized single-pass location tallying
  const targetGroup = confirmedCount > 0 ? confirmedAttendees : attendees;
  let topLocation = 'Asonkore';
  
  if (targetGroup.length > 0) {
    const locationCounts = targetGroup.reduce((acc, { location }) => {
      const loc = location || 'Asonkore';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    topLocation = Object.entries(locationCounts).reduce((max, curr) => 
      curr[1] > max[1] ? curr : max
    )[0];
  }

  const latestAttendee = attendees[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      
      {/* Total Confirmed Present */}
      <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all duration-200 flex items-center gap-3">
        <div className="bg-[#1B3B2B]/10 text-[#1B3B2B] p-2.5 rounded-lg shrink-0">
          <UserCheck size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Present</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold text-slate-800">{confirmedCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">/ {totalRegistered}</span>
          </div>
        </div>
      </div>

      {/* New Members Card */}
      <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-emerald-500/30 transition-all duration-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-lg shrink-0">
            <UserPlus size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">New Members</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{newMembersCount}</p>
          </div>
        </div>

        {onFilterNewMembers && newMembersCount > 0 && (
          <button
            type="button"
            onClick={onFilterNewMembers}
            className="group shrink-0 inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer border border-emerald-200/60 active:scale-95"
            title="Filter table to show only new members"
          >
            <span>View</span>
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Top Location */}
      <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-[#B89748]/30 transition-all duration-200 flex items-center gap-3">
        <div className="bg-[#B89748]/10 text-[#B89748] p-2.5 rounded-lg shrink-0">
          <MapPin size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Location</p>
          <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{totalRegistered > 0 ? topLocation : 'N/A'}</p>
        </div>
      </div>

      {/* Last Check-In Time */}
      <div className="bg-white px-4 py-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-blue-500/30 transition-all duration-200 flex items-center gap-3">
        <div className="bg-blue-500/10 text-blue-600 p-2.5 rounded-lg shrink-0">
          <Clock size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Check-In</p>
          <p className="text-xs font-bold text-slate-800 font-mono mt-0.5 truncate">
            {latestAttendee?.timestamp || 'None'}
          </p>
        </div>
      </div>

    </div>
  );
} 