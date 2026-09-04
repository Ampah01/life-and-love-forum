import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  query, 
  where 
} from 'firebase/firestore';

export const loadSessionsData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const q = query(
      collection(db, 'sessions'), 
      where('userId', '==', currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((docSnap) => {
      sessions.push({ id: docSnap.id, ...docSnap.data() });
    });

    return sessions;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
};

export const saveSessionsData = async (sessions) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    for (const session of sessions) {
      const sessionRef = doc(db, 'sessions', session.id);
      await setDoc(sessionRef, {
        ...session,
        userId: currentUser.uid 
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error saving user sessions:', error);
  }
};