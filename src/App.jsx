import React, { useState } from 'react';
import { useSessions } from './hooks/useSessions';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import AttendanceTable from './components/AttendanceTable';
import RecentFormsPanel from './components/RecentFormsPanel';
import FrequentAttendees from './components/FrequentAttendees';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import ExportButton from './components/ExportButton';
import AuthModal from './components/AuthModal';
import UserNavBar from './components/UserNavBar';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';
import QRCodeModal from './components/QRCodeModal';
import CreateSessionModal from './components/CreateSessionModal';
import PublicBookingRoute from './components/PublicBookingRoute';
import { QrCode } from 'lucide-react';

export default function App() {
  const {
    user,
    loading,
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    handleCheckIn,
    handleEditAttendee,
    handleDeleteAttendee,
    handleUpdateSession,
    handleCreateSession,
    handleDeleteSession,
    handleClearAllSessions,
    handleSignOut
  } = useSessions();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // If public booking URL is hit, render the public route component
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('booking') === 'true' && urlParams.get('session')) {
    return <PublicBookingRoute />;
  }

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthModal />;

  const query = searchQuery.toLowerCase().trim();

  const currentActiveSession = sessions.find((s) => s.id === activeSessionId) || activeSession;

  // Robust toggle handler supporting ID or array index mapping
  const handleToggleAttendance = async (attendeeIdOrIndex, currentStatus) => {
    if (!currentActiveSession || !currentActiveSession.attendees) return;

    // Find target attendee by ID or fallback to index matching
    const targetAttendee = currentActiveSession.attendees.find(
      (att, idx) => att.id === attendeeIdOrIndex || idx.toString() === attendeeIdOrIndex.toString()
    );

    if (!targetAttendee) {
      console.warn("Could not find target attendee for toggle.");
      return;
    }

    const updatedAttendee = {
      ...targetAttendee,
      attended: !currentStatus
    };

    if (typeof handleEditAttendee === 'function') {
      await handleEditAttendee(updatedAttendee); // Fixed signature to match useSessions hook
    }
  };

  const matchingSessionByAttendee = sessions.find((session) =>
    (session.attendees || []).some(
      (att) =>
        (att.name || '').toLowerCase().includes(query) ||
        (att.phone || '').includes(query) ||
        (att.location || '').toLowerCase().includes(query)
    )
  );

  const activeSessionHasMatch =
    query === '' ||
    (currentActiveSession?.title || '').toLowerCase().includes(query) ||
    (currentActiveSession?.theme || '').toLowerCase().includes(query) ||
    (currentActiveSession?.date || '').toLowerCase().includes(query) ||
    (currentActiveSession?.attendees || []).some(
      (att) =>
        (att.name || '').toLowerCase().includes(query) ||
        (att.phone || '').includes(query) ||
        (att.location || '').toLowerCase().includes(query)
    );

  const displaySession =
    !activeSessionHasMatch && matchingSessionByAttendee ? matchingSessionByAttendee : currentActiveSession;

  const filteredAttendees = (displaySession?.attendees || []).filter((att) => {
    if (!query) return true;
    const matchesName = (att.name || '').toLowerCase().includes(query);
    const matchesPhone = (att.phone || '').includes(query);
    const matchesLocation = (att.location || '').toLowerCase().includes(query);
    const matchesSessionTitle = (displaySession?.title || '').toLowerCase().includes(query);
    const matchesTheme = (displaySession?.theme || '').toLowerCase().includes(query);
    const matchesDate = (displaySession?.date || '').toLowerCase().includes(query);

    return matchesName || matchesPhone || matchesLocation || matchesSessionTitle || matchesTheme || matchesDate;
  });

  const filteredSessions = sessions.filter((session) => {
    if (!query) return true;
    const matchesSessionTitle = (session.title || '').toLowerCase().includes(query);
    const matchesTheme = (session.theme || '').toLowerCase().includes(query);
    const matchesDate = (session.date || '').toLowerCase().includes(query);

    const matchesAttendee = (session.attendees || []).some(
      (att) =>
        (att.name || '').toLowerCase().includes(query) ||
        (att.phone || '').includes(query) ||
        (att.location || '').toLowerCase().includes(query)
    );

    return matchesSessionTitle || matchesTheme || matchesDate || matchesAttendee;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans justify-between animate-fade-in duration-500">
      <div className="animate-slide-up duration-300">
        <UserNavBar user={user} onSignOut={handleSignOut} />

        <Header
          session={displaySession}
          onUpdateSession={handleUpdateSession}
          onNewSession={() => setIsNewSessionModalOpen(true)}
        />

        <main className="max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          <div className="md:col-span-8 flex flex-col space-y-5 md:space-y-6 order-1 md:order-1 transition-all">
            <StatsCards attendees={displaySession?.attendees || []} />

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md">
              <RegistrationForm onCheckIn={handleCheckIn} allSessions={sessions} />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm"
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

          <aside className="md:col-span-4 flex flex-col space-y-5 md:space-y-6 order-2 md:order-2">
            <RecentFormsPanel
              sessions={filteredSessions}
              activeSessionId={displaySession?.id}
              setActiveSessionId={setActiveSessionId}
              onCreateSession={handleCreateSession}
              onUpdateSession={handleUpdateSession}
              onDeleteSession={handleDeleteSession}
              onClearAll={handleClearAllSessions}
            />

            <FrequentAttendees sessions={sessions} />
          </aside>
        </main>
      </div>

      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        session={displaySession}
      />

      <CreateSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onCreateSession={handleCreateSession}
      />

      <Footer />
    </div>
  );
}