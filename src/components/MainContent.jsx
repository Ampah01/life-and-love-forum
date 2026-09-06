import React from 'react';
import StatsCards from './StatsCards';
import RegistrationForm from './RegistrationForm';
import SessionNotes from './SessionNotes';
import SearchBar from './SearchBar';
import WhatsAppReminderButton from './WhatsAppReminderButton';
import ExportButton from './ExportButton';
import AttendanceTable from './AttendanceTable';
import { QrCode } from 'lucide-react';

export default function MainContent({
  displaySession,
  sessions,
  searchQuery,
  setSearchQuery,
  filteredAttendees,
  handleCheckIn,
  handleUpdateNotes,
  handleToggleAttendance,
  setIsQrModalOpen
}) {
  return (
    <div className="md:col-span-8 flex flex-col space-y-5 md:space-y-6 order-1 md:order-1 transition-all">
      <StatsCards attendees={displaySession?.attendees || []} />

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
          
          {/* Uniform action buttons grouped on one line with horizontal scroll fallback for mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <WhatsAppReminderButton session={displaySession} />

            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <QrCode size={14} /> QR Code
            </button>

            <ExportButton
              attendees={displaySession?.attendees || []}
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
    </div>
  );
}