import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Users, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

export default function FrequentAttendees({ sessions = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Aggregate unique attendance counts across distinct sessions using ONLY the name
  const rankedAttendees = useMemo(() => {
    const countsMap = {};

    sessions.forEach((session) => {
      const processedInThisSession = new Set();

      (session.attendees || []).forEach((attendee) => {
        // Normalize name: lowercase, trim extra spaces for strict matching
        const cleanName = (attendee.name || '').trim().toLowerCase();

        if (!cleanName || cleanName === '') return;

        // Ensure each unique name is only counted once per session
        if (processedInThisSession.has(cleanName)) return;
        processedInThisSession.add(cleanName);

        if (!countsMap[cleanName]) {
          countsMap[cleanName] = {
            name: attendee.name.trim(), // Preserve original display casing
            phone: attendee.phone || 'N/A',
            count: 0,
            earliestTimestamp: attendee.timestamp || '23:59'
          };
        }
        
        countsMap[cleanName].count += 1;

        // Track earliest arrival timestamp
        if (attendee.timestamp && attendee.timestamp < countsMap[cleanName].earliestTimestamp) {
          countsMap[cleanName].earliestTimestamp = attendee.timestamp;
        }
      });
    });

    // Sort by highest distinct session count, then earliest arrival
    return Object.values(countsMap).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.earliestTimestamp.localeCompare(b.earliestTimestamp);
    });
  }, [sessions]);

  // Calculate average number of attendees per session
  const averageAttendees = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const totalAttendeesAllSessions = sessions.reduce((sum, s) => sum + (s.attendees?.length || 0), 0);
    return (totalAttendeesAllSessions / sessions.length).toFixed(1);
  }, [sessions]);

  // Helper for rank badge styling
  const getRankBadge = (index) => {
    if (index === 0) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs shadow-xs"><Trophy size={14} /></span>;
    if (index === 1) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs shadow-xs"><Medal size={14} /></span>;
    if (index === 2) return <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/10 text-amber-900 font-bold text-xs shadow-xs"><Medal size={14} /></span>;
    return <span className="text-slate-500 font-bold text-xs pl-2">#{index + 1}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col transition-all">
      
      {/* Clickable Header Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1B3B2B] text-white px-4 py-3 border-b-2 border-[#B89748] flex items-center justify-between focus:outline-none hover:bg-[#153022] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-[#B89748] p-1.5 rounded-lg text-white shadow-xs">
            <Trophy size={16} />
          </div>
          <h2 className="font-serif font-bold text-sm text-white tracking-wide">
            Attendance Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-md border border-white/10 text-xs">
            <Users size={12} className="text-[#B89748]" />
            <span className="text-white font-bold">{rankedAttendees.length}</span>
          </div>
          <div className="text-amber-200/90 transition-transform duration-200">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Collapsible Table Body */}
      {isOpen && (
        <div className="flex flex-col">
          <div className="overflow-x-auto max-h-[380px] overflow-y-auto custom-scrollbar animate-fadeIn">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold w-16 text-center">Rank</th>
                  <th className="py-3 px-4 font-semibold">Participant</th>
                  <th className="py-3 px-4 font-semibold">Number</th>
                  <th className="py-3 px-4 font-semibold text-center">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rankedAttendees.length > 0 ? (
                  rankedAttendees.slice(0, 5).map((person, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
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
                        <span className="inline-flex items-center gap-1 bg-[#1B3B2B]/10 text-[#1B3B2B] font-bold px-3 py-1 rounded-full text-xs border border-[#1B3B2B]/20">
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

          {/* Average Attendees Footer Button / Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#B89748]/10 text-[#B89748] p-1.5 rounded-lg">
                <BarChart3 size={15} />
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Average Attendance</span>
            </div>
            <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs text-xs font-extrabold text-[#1B3B2B]">
              {averageAttendees} people / session
            </span>
          </div>
        </div>
      )}

    </div>
  );
}