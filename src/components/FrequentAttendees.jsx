import React, { useMemo } from 'react';
import { Award, Trophy, Medal, Users } from 'lucide-react';

export default function FrequentAttendees({ sessions = [] }) {
  // Aggregate attendance counts and track earliest check-in times across all sessions
  const rankedAttendees = useMemo(() => {
    const countsMap = {};

    sessions.forEach((session) => {
      (session.attendees || []).forEach((attendee) => {
        const key = attendee.phone ? attendee.phone.trim() : attendee.name.trim().toLowerCase();
        
        if (!countsMap[key]) {
          countsMap[key] = {
            name: attendee.name,
            phone: attendee.phone || 'N/A',
            count: 0,
            earliestTimestamp: attendee.timestamp || '23:59' // fallback for comparison
          };
        }
        
        countsMap[key].count += 1;

        // Keep track of the earliest arrival timestamp if this one is earlier
        if (attendee.timestamp && attendee.timestamp < countsMap[key].earliestTimestamp) {
          countsMap[key].earliestTimestamp = attendee.timestamp;
        }
      });
    });

    // Convert to array and sort:
    // 1. Highest frequency first (descending)
    // 2. Tie-breaker: Earliest arrival timestamp (ascending, e.g., '08:00' comes before '09:00')
    return Object.values(countsMap).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.earliestTimestamp.localeCompare(b.earliestTimestamp);
    });
  }, [sessions]);

  // Helper for rank badge styling
  const getRankBadge = (index) => {
    if (index === 0) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs shadow-xs"><Trophy size={14} /></span>;
    if (index === 1) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs shadow-xs"><Medal size={14} /></span>;
    if (index === 2) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-900 font-bold text-xs shadow-xs"><Medal size={14} /></span>;
    return <span className="text-slate-500 font-bold text-xs pl-2">#{index + 1}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/85 shadow-md overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="bg-[#1B3B2B] text-white px-5 py-4 border-b-4 border-[#B89748] relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#B89748]/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#B89748] to-[#997a39] p-2.5 rounded-xl text-white shadow-sm ring-2 ring-white/10">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base tracking-wide text-white">
                Attendance Leaderboard
              </h2>
              <p className="text-[11px] text-amber-200/90 font-medium tracking-wider uppercase">
                Ranked by frequency & early arrival
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-200/30 shadow-inner">
            <Users size={14} className="text-[#B89748]" />
            <div className="text-xs flex items-center gap-1">
              <span className="text-slate-300 font-medium">Total:</span>
              <span className="font-bold text-white bg-[#B89748]/30 px-2 py-0.5 rounded-md border border-[#B89748]/40">
                {rankedAttendees.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 sticky top-0 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider backdrop-blur-xs z-10">
            <tr>
              <th className="py-3 px-4 font-semibold w-16 text-center">Rank</th>
              <th className="py-3 px-4 font-semibold">Participant</th>
              <th className="py-3 px-4 font-semibold">Phone Number</th>
              <th className="py-3 px-4 font-semibold text-center">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rankedAttendees.length > 0 ? (
              rankedAttendees.map((person, index) => (
                <tr key={index} className="hover:bg-slate-50/85 transition-colors group">
                  <td className="py-3.5 px-4 flex items-center justify-center">
                    {getRankBadge(index)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 group-hover:text-[#1B3B2B] transition-colors">
                      {person.name}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                    {person.phone}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-[#1B3B2B]/10 text-[#1B3B2B] font-bold px-3 py-1 rounded-full text-xs border border-[#1B3B2B]/20 shadow-2xs">
                      {person.count} {person.count === 1 ? 'Session' : 'Sessions'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400 text-sm italic">
                  No attendance records logged across sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}