import React from 'react';
import { Users, MapPin, Clock, UserCheck } from 'lucide-react';

export default function StatsCards({ attendees = [] }) {
  // Filter only attendees who have been confirmed as present
  const confirmedAttendees = attendees.filter((att) => att.attended === true);
  const confirmedCount = confirmedAttendees.length;
  const totalRegistered = attendees.length;

  // Optimized single-pass location tallying (based on confirmed attendees, or all attendees if none confirmed)
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

  // Because new attendees are unshifted to the front, attendees[0] is the most recent check-in
  const latestAttendee = attendees[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      {/* Total Confirmed Present */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 transition-all hover:shadow-md">
        <div className="bg-[#1B3B2B]/10 p-3 rounded-xl text-[#1B3B2B] shadow-inner">
          <UserCheck size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Present</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <p className="text-xl font-black text-slate-800">{confirmedCount}</p>
            <p className="text-xs text-slate-400 font-medium">/ {totalRegistered} registered</p>
          </div>
        </div>
      </div>

      {/* Top Location */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 transition-all hover:shadow-md">
        <div className="bg-[#B89748]/10 p-3 rounded-xl text-[#B89748] shadow-inner">
          <MapPin size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Location</p>
          <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{totalRegistered > 0 ? topLocation : 'N/A'}</p>
        </div>
      </div>

      {/* Last Check-In Time */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 transition-all hover:shadow-md">
        <div className="bg-blue-500/10 p-3 rounded-xl text-blue-600 shadow-inner">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Check-In</p>
          <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">
            {latestAttendee?.timestamp || 'None'}
          </p>
        </div>
      </div>

    </div>
  );
}