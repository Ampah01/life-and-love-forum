import React, { useState } from 'react';
import StatsCards from './StatsCards';
import RegistrationForm from './RegistrationForm';
import SessionNotes from './SessionNotes';
import SearchBar from './SearchBar';
import WhatsAppReminderButton from './WhatsAppReminderButton';
import ExportButton from './ExportButton';
import AttendanceTable from './AttendanceTable';
import { QrCode, UserX, AlertTriangle, X } from 'lucide-react';

export default function MainContent({
  displaySession,
  sessions,
  newMembers = [],
  searchQuery,
  setSearchQuery,
  filteredAttendees,
  handleCheckIn,
  handleUpdateNotes,
  handleToggleAttendance,
  handleDeleteAbsentees,
  setIsQrModalOpen
}) {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleFilterNewMembers = () => {
    if (newMembers.length === 0) return;
    setSearchQuery(newMembers[0]?.name || '');
  };

  const attendeesList = displaySession?.attendees || [];
  const hasAbsentees = attendeesList.some((att) => !att.attended);
  const absenteeCount = attendeesList.filter((att) => !att.attended).length;

  const confirmDeleteAbsentees = () => {
    handleDeleteAbsentees();
    setIsClearModalOpen(false);
  };

  return (
    <div className="md:col-span-8 flex flex-col space-y-5 md:space-y-6 order-1 md:order-1 transition-all">
      <StatsCards 
        attendees={attendeesList} 
        newMembers={newMembers}
        onFilterNewMembers={handleFilterNewMembers}
      />

      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md">
        <RegistrationForm onCheckIn={handleCheckIn} allSessions={sessions} />
      </div>

      <SessionNotes 
        session={displaySession} 
        onUpdateNotes={handleUpdateNotes} 
      />

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {hasAbsentees && (
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="group/delete shrink-0 inline-flex items-center gap-1.5 bg-rose-50/80 hover:bg-rose-600 text-rose-700 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer border border-rose-200 hover:border-rose-600 active:scale-95 whitespace-nowrap"
                title="Remove all unconfirmed attendees from this session"
              >
                <UserX size={14} className="transition-transform duration-300 group-hover/delete:scale-110" />
                <span>Clear Absentees</span>
              </button>
            )}

            <WhatsAppReminderButton session={displaySession} />

            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <QrCode size={14} /> QR Code
            </button>

            <ExportButton
              attendees={attendeesList}
              sessionTitle={displaySession?.title}
              theme={displaySession?.theme}
              date={displaySession?.date}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md">
          <AttendanceTable
            attendees={filteredAttendees}
            onToggleAttendance={handleToggleAttendance}
          />
        </div>
      </div>

      {/* Custom Confirmation Modal Design */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Clear Unconfirmed Attendees</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              <button 
                onClick={() => setIsClearModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                You are about to remove <span className="font-semibold text-slate-900">{absenteeCount} unconfirmed {absenteeCount === 1 ? 'attendee' : 'attendees'}</span> who {absenteeCount === 1 ? 'has' : 'have'} not been marked as present for <span className="font-medium text-slate-800">"{displaySession?.title}"</span>.
              </p>
              <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Only attendees who have their check-in confirmed will remain in this session's active record.
                </p>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shadow-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAbsentees}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm cursor-pointer active:scale-95 inline-flex items-center gap-1.5"
              >
                <UserX size={14} /> Yes, Clear Absentees
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}