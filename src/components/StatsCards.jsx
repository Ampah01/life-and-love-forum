import React from 'react';
import { Users, MapPin, Clock } from 'lucide-react';

export default function StatsCards({ attendees = [] }) {
  const totalCount = attendees.length;

  // Optimized single-pass location tallying
  let topLocation = 'Asonkore';
  if (totalCount > 0) {
    const locationCounts = attendees.reduce((acc, { location }) => {
      const loc = location || 'Asonkore';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    topLocation = Object.entries(locationCounts).reduce((max, curr) => 
      curr[1] > max[1] ? curr : max
    )[0];
  }

  const firstAttendee = attendees[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      {/* Total Present */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="bg-[#1B3B2B]/10 p-3 rounded-lg text-[#1B3B2B]">
          <Users size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Present</p>
          <p className="text-xl font-bold text-slate-800">{totalCount}</p>
        </div>
      </div>

      {/* Top Location */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="bg-[#B89748]/10 p-3 rounded-lg text-[#B89748]">
          <MapPin size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase">Top Location</p>
          <p className="text-sm font-bold text-slate-800 truncate">{totalCount > 0 ? topLocation : 'N/A'}</p>
        </div>
      </div>

      {/* First Check-In */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="bg-blue-500/10 p-3 rounded-lg text-blue-600">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase">First Check-In</p>
          <p className="text-xs font-bold text-slate-800">
            {firstAttendee?.timestamp || 'None'}
          </p>
        </div>
      </div>

    </div>
  );
}