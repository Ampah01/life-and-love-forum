import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { loadSessionsData, saveSessionsData } from '../services/storage';

const DEFAULT_SESSION = {
  id: 'session-1',
  title: 'Life & Love Forum - Session 1',
  theme: 'Whole & Ready',
  date: new Date().toISOString().split('T')[0],
  time: 'Every Tuesday, 6:30 PM - 8:00 PM',
  venue: 'ICGC Worship Temple, Asonkore',
  attendees: []
};

export function useSessions() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetched = await loadSessionsData();
        if (fetched && fetched.length > 0) {
          setSessions(fetched);
          setActiveSessionId(fetched[0].id);
        } else {
          setSessions([DEFAULT_SESSION]);
          setActiveSessionId(DEFAULT_SESSION.id);
          await saveSessionsData([DEFAULT_SESSION]);
        }
      } else {
        setSessions([]);
        setActiveSessionId('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const updateAndSaveSessions = async (newSessions) => {
    setSessions(newSessions);
    await saveSessionsData(newSessions);
  };

  const handleCheckIn = async (formData) => {
    const newAttendee = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      location: formData.location || 'Asonkore',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = sessions.map((s) =>
      s.id === activeSessionId
        ? { ...s, attendees: [newAttendee, ...(s.attendees || [])] }
        : s
    );
    await updateAndSaveSessions(updated);
  };

  const handleEditAttendee = async (updatedAttendee) => {
    const updated = sessions.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            attendees: (s.attendees || []).map((a) =>
              a.id === updatedAttendee.id ? updatedAttendee : a
            )
          }
        : s
    );
    await updateAndSaveSessions(updated);
  };

  const handleDeleteAttendee = async (attendeeId) => {
    const updated = sessions.map((s) =>
      s.id === activeSessionId
        ? { ...s, attendees: (s.attendees || []).filter((a) => a.id !== attendeeId) }
        : s
    );
    await updateAndSaveSessions(updated);
  };

  const handleUpdateSession = async (updatedSession) => {
    const updated = sessions.map((s) => {
      if (s.id === updatedSession.id) {
        return {
          ...s,
          ...updatedSession,
          // Preserve existing attendees if updatedSession doesn't explicitly pass them
          attendees: updatedSession.attendees ?? s.attendees ?? []
        };
      }
      return s;
    });
    await updateAndSaveSessions(updated);
  };

  const handleCreateSession = async (sessionData) => {
    const isObject = typeof sessionData === 'object' && sessionData !== null;

    const newSession = {
      id: `session-${Date.now()}`,
      title: isObject ? sessionData.title : sessionData,
      theme: (isObject ? sessionData.theme : arguments[1]) || 'Life & Love Forum',
      date: (isObject ? sessionData.date : null) || new Date().toISOString().split('T')[0],
      time: (isObject ? sessionData.time : null) || 'Every Tuesday, 6:30 PM - 8:00 PM',
      venue: (isObject ? sessionData.venue : null) || 'ICGC Worship Temple, Asonkore',
      attendees: []
    };

    const updated = [newSession, ...sessions];
    setActiveSessionId(newSession.id);
    await updateAndSaveSessions(updated);
  };

  const handleDeleteSession = async (sessionIdToDelete) => {
    const updated = sessions.filter((s) => s.id !== sessionIdToDelete);
    if (updated.length > 0) {
      setSessions(updated);
      if (activeSessionId === sessionIdToDelete) {
        setActiveSessionId(updated[0].id);
      }
      await saveSessionsData(updated);
    } else {
      setSessions([DEFAULT_SESSION]);
      setActiveSessionId(DEFAULT_SESSION.id);
      await saveSessionsData([DEFAULT_SESSION]);
    }
  };

  const handleClearAllSessions = async () => {
    if (window.confirm('Are you sure you want to clear all your sessions and reset your attendance log?')) {
      const reset = [DEFAULT_SESSION];
      setSessions(reset);
      setActiveSessionId(DEFAULT_SESSION.id);
      await saveSessionsData(reset);
    }
  };

  const handleSignOut = () => signOut(auth);

  return {
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
  };
}