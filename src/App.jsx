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
  
  // Custom modal states for new session creation
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionTheme, setNewSessionTheme] = useState('');

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

  // Handler to submit the custom session form
  const handleCreateSessionSubmit = (e) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const date = new Date().toISOString().split('T')[0];
    handleCreateSession({
      title: newSessionTitle.trim(),
      theme: newSessionTheme.trim(),
      date
    });

    // Reset and close modal
    setNewSessionTitle('');
    setNewSessionTheme('');
    setIsNewSessionModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans justify-between">
      <div>
        <UserNavBar user={activeUser} onSignOut={handleSignOut} />
        
        {/* Header with integrated mobile new session action */}
        <Header 
          session={displaySession} 
          onUpdateSession={handleUpdateSession} 
          onNewSession={() => setIsNewSessionModalOpen(true)}
        />

        <main className="max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          
          {/* Main Workspace Column */}
          <div className="md:col-span-8 flex flex-col space-y-5 md:space-y-6 order-1 md:order-1">
            <StatsCards attendees={displaySession?.attendees || []} />

            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200">
              <RegistrationForm onCheckIn={handleCheckIn} allSessions={sessions} />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <ExportButton
                  attendees={displaySession?.attendees || []}
                  sessionTitle={displaySession?.title || 'session'}
                />
              </div>

              <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <AttendanceTable
                  attendees={filteredAttendees}
                  onEditAttendee={handleEditAttendee}
                  onDeleteAttendee={handleDeleteAttendee}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
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

      {/* Custom Styled Confirmation Modal for New Session */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#1B3B2B] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B89748]"></span>
                <h3 className="font-bold text-lg">Create New Session</h3>
              </div>
              <button 
                onClick={() => setIsNewSessionModalOpen(false)}
                className="text-slate-300 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateSessionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session 1"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Session Theme (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g Whole and Ready"
                  value={newSessionTheme}
                  onChange={(e) => setNewSessionTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] text-slate-800 text-sm"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1B3B2B] hover:bg-[#12281d] text-white shadow transition"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer pinned cleanly at bottom */}
      <Footer />
    </div>
  );
} 