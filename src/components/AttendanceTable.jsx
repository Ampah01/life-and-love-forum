import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Search, Phone, MapPin } from 'lucide-react';

export default function AttendanceTable({ attendees = [], onToggleAttendance }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'present' | 'noshow'

  // Filter attendees based on search input (name or phone)
  const filteredAttendees = attendees.filter((attendee) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = attendee.name?.toLowerCase().includes(term) || false;
    const phoneMatch = attendee.phone?.toLowerCase().includes(term) || false;
    return nameMatch || phoneMatch;
  });

  // Group filtered attendees
  const presentAttendees = filteredAttendees.filter(a => a.attended === true);
  const noShowAttendees = filteredAttendees.filter(a => !a.attended);

  // Determine which list to display based on active tab
  const displayedAttendees = 
    activeTab === 'present' ? presentAttendees :
    activeTab === 'noshow' ? noShowAttendees : 
    filteredAttendees;

  // Safe handler wrapper to prevent crashes if prop is missing
  const handleActionClick = (attendeeId, currentStatus) => {
    if (typeof onToggleAttendance === 'function') {
      onToggleAttendance(attendeeId, currentStatus);
    } else {
      console.warn("onToggleAttendance function prop was not provided to AttendanceTable.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 md:p-6 space-y-6">
      
      {/* Header & Summary Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Users className="text-[#1B3B2B]" size={20} />
            Session Attendance Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage check-ins, track seat reservations, and follow up with no-shows.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>Present: {presentAttendees.length}</span>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <XCircle size={14} />
            <span>No-Shows: {noShowAttendees.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Tabs / Segmented Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'all' 
                ? 'bg-white text-[#1B3B2B] shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bookings ({attendees.length})
          </button>
          <button
            onClick={() => setActiveTab('present')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'present' 
                ? 'bg-white text-emerald-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Present ({presentAttendees.length})
          </button>
          <button
            onClick={() => setActiveTab('noshow')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'noshow' 
                ? 'bg-white text-red-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            No-Shows ({noShowAttendees.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1B3B2B]"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Attendee Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {displayedAttendees.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500 italic">
                  No records found matching your filter.
                </td>
              </tr>
            ) : (
              displayedAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-semibold text-[#1B3B2B]">
                    {attendee.name}
                  </td>
                  <td className="p-3 text-slate-600 flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" />
                    {attendee.phone}
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {attendee.location || 'Not Specified'}
                    </span>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                      attendee.attended 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {attendee.attended ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {attendee.attended ? 'Present' : 'Absent'}
                    </span>
                  </td>

                  {/* Toggle Action Button */}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleActionClick(attendee.id, attendee.attended)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 ${
                        attendee.attended
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          : 'bg-[#1B3B2B] hover:bg-[#142d21] text-white'
                      }`}
                    >
                      {attendee.attended ? 'Absent' : 'Confirm'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}