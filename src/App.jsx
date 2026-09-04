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

  if (loading) return <LoadingScreen />;
  const activeUser = user;
  if (!activeUser) return <AuthModal />;

  const query = searchQuery.toLowerCase().trim();

  // 1. Find if any session contains an attendee or title matching the search query
  const matchingSessionByAttendee = sessions.find((session) =>
    (session.attendees || []).some(
      (att) =>
        (att.name || '').toLowerCase().includes(query) ||
        (att.phone || '').includes(query) ||
        (att.location || '').toLowerCase().includes(query)
    )
  );

  const currentActiveSession = sessions.find((s) => s.id === activeSessionId) || activeSession;

  // 2. Check if the currently active session has the search match
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

  // 3. Determine the display session: if active doesn't match but another session has the attendee, switch to it
  const displaySession =
    !activeSessionHasMatch && matchingSessionByAttendee ? matchingSessionByAttendee : currentActiveSession;

  // 4. Filter attendees for the display session
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

  // Filter sessions for the sidebar panel
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
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <UserNavBar user={activeUser} onSignOut={handleSignOut} />
      <Header session={displaySession} onUpdateSession={handleUpdateSession} />

      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Active Session Workspace */}
        <div className="md:col-span-8 space-y-6">
          <StatsCards attendees={displaySession?.attendees || []} />

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <RegistrationForm onCheckIn={handleCheckIn} allSessions={sessions} />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <ExportButton
                attendees={displaySession?.attendees || []}
                sessionTitle={displaySession?.title || 'session'}
              />
            </div>

            <AttendanceTable
              attendees={filteredAttendees}
              onEditAttendee={handleEditAttendee}
              onDeleteAttendee={handleDeleteAttendee}
            />
          </div>
        </div>

        {/* Right Column: Sessions & Leaderboard Sidebar */}
        <aside className="md:col-span-4 space-y-6">
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
  );
}