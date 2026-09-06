import React from 'react';
import RecentFormsPanel from './RecentFormsPanel';
import FrequentAttendees from './FrequentAttendees';

export default function SidebarContent({
  filteredSessions,
  displaySession,
  setActiveSessionId,
  handleCreateSession,
  handleUpdateSession,
  handleDeleteSession,
  handleClearAllSessions,
  sessions
}) {
  return (
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
  );
}