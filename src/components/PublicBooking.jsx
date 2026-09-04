import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PublicBooking({ sessionId }) {
  const [sessionData, setSessionData] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', location: 'Asonkore' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch session details to check deadline & title
  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionRef = doc(db, 'sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          setSessionData(sessionSnap.data());
        } else {
          setError('This session could not be found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load session details.');
      } finally {
        setLoadingSession(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  if (loadingSession) {
    return <div className="text-center py-12 text-xs text-slate-500">Loading booking portal...</div>;
  }

  // Check if booking deadline has passed
  const isDeadlinePassed = sessionData?.bookingDeadline 
    ? new Date() > new Date(sessionData.bookingDeadline) 
    : false;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (isDeadlinePassed) {
      setError('The booking deadline for this session has passed.');
      return;
    }
    if (!formData.name || !formData.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      const currentData = sessionSnap.data();
      const existingAttendees = currentData.attendees || [];

      const alreadyBooked = existingAttendees.find(a => a.phone === formData.phone.trim());
      if (alreadyBooked) {
        throw new Error('This phone number is already registered for this session!');
      }

      const newBooking = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim() || 'Asonkore',
        status: 'booked',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      await updateDoc(sessionRef, {
        attendees: [newBooking, ...existingAttendees]
      });

      setSuccess(true);
      setFormData({ name: '', phone: '', location: 'Asonkore' });
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-200 text-center space-y-4">
        <div className="flex justify-center text-emerald-600"><CheckCircle2 size={52} /></div>
        <h2 className="text-xl font-bold text-slate-800">Booking Successful!</h2>
        <p className="text-xs text-slate-600">Your seat has been reserved for <span className="font-semibold">{sessionData?.title}</span>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-200 space-y-5">
      <div>
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {sessionData?.title || 'Session Booking'}
        </span>
        <h2 className="font-extrabold text-slate-800 text-lg mt-2">{sessionData?.theme || 'Pre-Program Registration'}</h2>
        
        {sessionData?.bookingDeadline && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <Clock size={13} className="text-amber-600" />
            <span>Booking closes: {new Date(sessionData.bookingDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
        )}
      </div>

      {isDeadlinePassed ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Booking Closed</p>
            <p className="mt-0.5 text-[11px]">The deadline to book spots for this session has passed. Please contact the coordinator for assistance.</p>
          </div>
        </div>
      ) : (
        <>
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>}

          <form onSubmit={handleBooking} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Ampah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 0241234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Residence</label>
              <input
                type="text"
                placeholder="e.g. Asonkore"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1B3B2B] text-white text-xs font-bold py-3 rounded-lg hover:bg-[#142d21] transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>Confirm Booking</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}