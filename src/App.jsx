import React, { useState } from 'react';
import { useSessions } from './hooks/useSessions';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import UserNavBar from './components/UserNavBar';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';
import PublicBookingRoute from './components/PublicBookingRoute';
import MainContent from './components/MainContent';
import SidebarContent from './components/SidebarContent';
import AppModals from './components/AppModals';

export default function App() {
  const {
    user,
    loading,
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    newMembers,
    handleCheckIn,
    handleEditAttendee,
    handleUpdateSession,
    handleUpdateNotes,
    handleCreateSession,
    handleDeleteSession,
    handleClearAllSessions,
    handleSignOut,
    handleDeleteAbsentees 
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

  // Ensure active session defaults to the top sorted session if none is selected
  const currentActiveSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || activeSession;

  // Robust toggle handler supporting ID or array index mapping
  const handleToggleAttendance = async (attendeeIdOrIndex, currentStatus) => {
    if (!currentActiveSession || !currentActiveSession.attendees) return;

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
      await handleEditAttendee(updatedAttendee);
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
          <MainContent
  displaySession={displaySession}
  sessions={sessions}
  newMembers={newMembers}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  filteredAttendees={filteredAttendees}
  handleCheckIn={handleCheckIn}
  handleUpdateNotes={handleUpdateNotes}
  handleToggleAttendance={handleToggleAttendance}
  handleDeleteAbsentees={handleDeleteAbsentees} 
  setIsQrModalOpen={setIsQrModalOpen}
/>

          <SidebarContent
            filteredSessions={filteredSessions}
            displaySession={displaySession}
            setActiveSessionId={setActiveSessionId}
            handleCreateSession={handleCreateSession}
            handleUpdateSession={handleUpdateSession}
            handleDeleteSession={handleDeleteSession}
            handleClearAllSessions={handleClearAllSessions}
            sessions={sessions}
          />
        </main>
      </div>

      <AppModals
        isQrModalOpen={isQrModalOpen}
        setIsQrModalOpen={setIsQrModalOpen}
        isNewSessionModalOpen={isNewSessionModalOpen}
        setIsNewSessionModalOpen={setIsNewSessionModalOpen}
        displaySession={displaySession}
        handleCreateSession={handleCreateSession}
      />

      <Footer />
    </div>
  );
}