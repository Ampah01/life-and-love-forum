import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const DEFAULT_SESSION = {
  id: 'session-1',
  title: 'Life & Love Forum - Session 1',
  theme: 'Whole & Ready',
  date: new Date().toISOString().split('T')[0],
  time: 'Every Tuesday, 6:30 PM - 8:00 PM',
  venue: 'ICGC Worship Temple, Asonkore',
  attendees: [],
  notes: ''
};

// Helper to sort sessions by date descending (most recent first)
const sortSessionsByDate = (sessionList) => {
  return [...sessionList].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
};

export function useSessions() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');

  // Fetch sessions from Firestore for the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const q = query(collection(db, 'sessions'), where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          let fetchedSessions = [];
          querySnapshot.forEach((docSnap) => {
            fetchedSessions.push({ id: docSnap.id, ...docSnap.data() });
          });

          if (fetchedSessions.length > 0) {
            const sorted = sortSessionsByDate(fetchedSessions);
            setSessions(sorted);
            setActiveSessionId(sorted[0].id); // Automatically select the most recent session by date
          } else {
            // Save default session to Firestore if none exist
            const defaultWithUser = { ...DEFAULT_SESSION, userId: currentUser.uid };
            await setDoc(doc(db, 'sessions', DEFAULT_SESSION.id), defaultWithUser);
            setSessions([defaultWithUser]);
            setActiveSessionId(DEFAULT_SESSION.id);
          }
        } catch (err) {
          console.error("Error loading sessions from Firestore:", err);
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

  // Helper to save a single session document in Firestore
  const saveSessionToDb = async (sessionObj) => {
    if (!user) return;
    const docRef = doc(db, 'sessions', sessionObj.id);
    await setDoc(docRef, { ...sessionObj, userId: user.uid }, { merge: true });
  };

  // Strict check-in handler preventing duplicate names AND phone numbers per session
  const handleCheckIn = async (formData, targetSessionId = activeSessionId) => {
    let targetSession = null;
    let errorReason = null;

    const updated = sessions.map((s) => {
      if (s.id === targetSessionId) {
        const attendees = s.attendees || [];

        const incomingName = (formData.name || '').trim().toLowerCase();
        const incomingPhone = (formData.phone || '').trim();

        // Check if name or phone already exists in this session
        const isDuplicate = attendees.some((att) => {
          const existingName = (att.name || '').trim().toLowerCase();
          const existingPhone = (att.phone || '').trim();

          const nameMatches = incomingName && existingName && incomingName === existingName;
          const phoneMatches = incomingPhone && existingPhone && incomingPhone === existingPhone;

          return nameMatches || phoneMatches;
        });

        if (isDuplicate) {
          errorReason = 'An attendee with this exact name or phone number is already registered in this session!';
          return s;
        }

        const newAttendee = {
          id: Date.now().toString(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location || 'Asonkore',
          attended: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        targetSession = { ...s, attendees: [newAttendee, ...attendees] };
        return targetSession;
      }
      return s;
    });

    if (errorReason) {
      return { 
        success: false, 
        message: errorReason 
      };
    }

    setSessions(updated);
    if (targetSession) await saveSessionToDb(targetSession);
    return { success: true };
  };

  const handleEditAttendee = async (updatedAttendee) => {
    let targetSession = null;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        targetSession = {
          ...s,
          attendees: (s.attendees || []).map((a) =>
            a.id === updatedAttendee.id ? updatedAttendee : a
          )
        };
        return targetSession;
      }
      return s;
    });

    setSessions(updated);
    if (targetSession) await saveSessionToDb(targetSession);
  };

  const handleDeleteAttendee = async (attendeeId) => {
    let targetSession = null;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        targetSession = { ...s, attendees: (s.attendees || []).filter((a) => a.id !== attendeeId) };
        return targetSession;
      }
      return s;
    });

    setSessions(updated);
    if (targetSession) await saveSessionToDb(targetSession);
  };

  const handleUpdateSession = async (updatedSession) => {
    let targetSession = null;
    const rawUpdated = sessions.map((s) => {
      if (s.id === updatedSession.id) {
        targetSession = {
          ...s,
          ...updatedSession,
          attendees: updatedSession.attendees ?? s.attendees ?? []
        };
        return targetSession;
      }
      return s;
    });

    // Re-sort in case the date was changed during the edit
    const sorted = sortSessionsByDate(rawUpdated);
    setSessions(sorted);
    if (targetSession) await saveSessionToDb(targetSession);
  };

  // Handler to update meeting minutes / session notes
  const handleUpdateNotes = async (newNotes) => {
    let targetSession = null;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        targetSession = { ...s, notes: newNotes };
        return targetSession;
      }
      return s;
    });

    setSessions(updated);
    if (targetSession) await saveSessionToDb(targetSession);
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
      attendees: [],
      notes: ''
    };

    const sorted = sortSessionsByDate([newSession, ...sessions]);
    setSessions(sorted);
    setActiveSessionId(newSession.id); // Instantly jump to the newly created session
    await saveSessionToDb(newSession);
  };

  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      await deleteDoc(doc(db, 'sessions', sessionIdToDelete));

      const updated = sessions.filter((s) => s.id !== sessionIdToDelete);
      if (updated.length > 0) {
        const sorted = sortSessionsByDate(updated);
        setSessions(sorted);
        if (activeSessionId === sessionIdToDelete) {
          setActiveSessionId(sorted[0].id);
        }
      } else {
        const defaultWithUser = { ...DEFAULT_SESSION, userId: user.uid };
        await setDoc(doc(db, 'sessions', DEFAULT_SESSION.id), defaultWithUser);
        setSessions([defaultWithUser]);
        setActiveSessionId(DEFAULT_SESSION.id);
      }
    } catch (err) {
      console.error("Error deleting session from database:", err);
    }
  };

  const handleClearAllSessions = async () => {
    try {
      if (!user) return;

      const q = query(collection(db, 'sessions'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'sessions', docSnap.id))
      );
      await Promise.all(deletePromises);

      const defaultWithUser = { ...DEFAULT_SESSION, userId: user.uid };
      await setDoc(doc(db, 'sessions', DEFAULT_SESSION.id), defaultWithUser);
      setSessions([defaultWithUser]);
      setActiveSessionId(DEFAULT_SESSION.id);
    } catch (err) {
      console.error("Error clearing sessions from database:", err);
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
    handleUpdateNotes,
    handleCreateSession,
    handleDeleteSession,
    handleClearAllSessions,
    handleSignOut
  };
}