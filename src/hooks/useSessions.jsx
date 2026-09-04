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
  attendees: []
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
          
          const fetchedSessions = [];
          querySnapshot.forEach((docSnap) => {
            fetchedSessions.push({ id: docSnap.id, ...docSnap.data() });
          });

          if (fetchedSessions.length > 0) {
            setSessions(fetchedSessions);
            setActiveSessionId(fetchedSessions[0].id);
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

  const handleCheckIn = async (formData) => {
    const newAttendee = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      location: formData.location || 'Asonkore',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let targetSession = null;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        targetSession = { ...s, attendees: [newAttendee, ...(s.attendees || [])] };
        return targetSession;
      }
      return s;
    });

    setSessions(updated);
    if (targetSession) await saveSessionToDb(targetSession);
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
    const updated = sessions.map((s) => {
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
      attendees: []
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    await saveSessionToDb(newSession);
  };

  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      // 1. Permanently delete document from Firestore database
      await deleteDoc(doc(db, 'sessions', sessionIdToDelete));

      const updated = sessions.filter((s) => s.id !== sessionIdToDelete);
      if (updated.length > 0) {
        setSessions(updated);
        if (activeSessionId === sessionIdToDelete) {
          setActiveSessionId(updated[0].id);
        }
      } else {
        // Fallback to default session if all deleted
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

      // Fetch all user session documents from Firestore
      const q = query(collection(db, 'sessions'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      // Delete all documents in parallel
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'sessions', docSnap.id))
      );
      await Promise.all(deletePromises);

      // Reset to default session
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
    handleCreateSession,
    handleDeleteSession,
    handleClearAllSessions,
    handleSignOut
  };
}