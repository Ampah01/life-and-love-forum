import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Edit3, Check, X, Plus, Clock } from 'lucide-react';

export default function Header({ session, onUpdateSession, onNewSession }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    title: '',
    theme: '',
    date: '',
    time: '',
    venue: '',
    bookingDeadline: ''
  });

  useEffect(() => {
    if (session) {
      setEditFields({
        title: session.title || '',
        theme: session.theme || '',
        date: session.date || '',
        time: session.time || '',
        venue: session.venue || '',
        bookingDeadline: session.bookingDeadline || ''
      });
    }
  }, [session]);

  const handleSave = () => {
    onUpdateSession({
      ...session,
      title: editFields.title,
      theme: editFields.theme,
      date: editFields.date,
      time: editFields.time,
      venue: editFields.venue,
      bookingDeadline: editFields.bookingDeadline || null
    });
    setIsEditing(false);
  };

  return (
    <header className="bg-[#1B3B2B] text-white p-4 md:p-6 border-b-4 border-[#B89748] shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Top Control Bar: Mobile New Session & Status */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 md:hidden">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-[10px] uppercase tracking-wider bg-[#B89748] text-white px-2 py-0.5 rounded font-bold">Active</span>
            <span className="text-xs font-semibold truncate">{session?.title || 'No Session'}</span>
          </div>
          {onNewSession && (
            <button
              onClick={onNewSession}
              className="bg-[#B89748] hover:bg-[#a2823f] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1 shrink-0"
            >
              <Plus size={14} />
              <span>New Session</span>
            </button>
          )}
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Main Title & Theme Card */}
          <div className="bg-[#F7F5EC] text-slate-900 rounded-xl p-4 shadow-md relative">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-[#1B3B2B] bg-slate-200 hover:bg-slate-300 rounded-lg transition"
              title="Edit Session Metadata"
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            </button>

            {isEditing ? (
              <div className="space-y-2 mt-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Session Title</label>
                <input
                  type="text"
                  value={editFields.title}
                  onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs font-bold text-[#1B3B2B]"
                  placeholder="Session Title"
                />

                <label className="block text-[10px] font-bold text-slate-500 uppercase">Theme</label>
                <input
                  type="text"
                  value={editFields.theme}
                  onChange={(e) => setEditFields({ ...editFields, theme: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                  placeholder="Theme"
                />

                <label className="block text-[10px] font-bold text-slate-500 uppercase">Booking Deadline</label>
                <input
                  type="datetime-local"
                  value={editFields.bookingDeadline}
                  onChange={(e) => setEditFields({ ...editFields, bookingDeadline: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />

                <button
                  onClick={handleSave}
                  className="bg-[#1B3B2B] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold mt-2 hover:bg-[#142d21] transition"
                >
                  <Check size={14} /> Save Details
                </button>
              </div>
            ) : (
              <div>
                <h1 className="font-serif text-xl md:text-2xl font-bold text-[#1B3B2B] uppercase tracking-wide">
                  {session?.title || 'No Session Active'}
                </h1>
                <span className="inline-block bg-[#B89748] text-white font-bold text-xs px-3 py-0.5 rounded-full uppercase my-1">
                  {session?.theme || 'Set Theme'}
                </span>
                <p className="text-xs text-slate-600 italic">
                  Real conversations on life, love & lasting family.
                </p>
                {session?.bookingDeadline && (
                  <p className="text-[11px] text-amber-700 mt-2 flex items-center gap-1 font-medium">
                    <Clock size={12} /> Deadline: {new Date(session.bookingDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Date, Schedule & Venue Cards */}
          <div className="flex flex-col sm:flex-row gap-3 md:col-span-2">
            {/* Schedule & Date Card */}
            <div className="bg-[#F7F5EC] text-slate-900 flex-1 rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="bg-[#B89748]/20 p-2.5 rounded-lg text-[#B89748]">
                <Calendar size={22} />
              </div>
              <div className="w-full space-y-1">
                <p className="font-bold text-sm text-[#1B3B2B]">Date & Schedule</p>
                {isEditing ? (
                  <>
                    <input
                      type="date"
                      value={editFields.date}
                      onChange={(e) => setEditFields({ ...editFields, date: e.target.value })}
                      className="w-full border border-slate-300 rounded p-1 text-xs"
                    />
                    <input
                      type="text"
                      value={editFields.time}
                      onChange={(e) => setEditFields({ ...editFields, time: e.target.value })}
                      className="w-full border border-slate-300 rounded p-1 text-xs"
                      placeholder="e.g. 6:30 PM - 8:00 PM"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">{session?.date || 'Date Not Set'}</p>
                    <p className="text-[11px] text-slate-500">{session?.time || 'Schedule Not Set'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-[#F7F5EC] text-slate-900 flex-1 rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="bg-[#B89748]/20 p-2.5 rounded-lg text-[#B89748]">
                <MapPin size={22} />
              </div>
              <div className="w-full">
                <p className="font-bold text-sm text-[#1B3B2B]">Venue</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFields.venue}
                    onChange={(e) => setEditFields({ ...editFields, venue: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1 text-xs mt-1"
                    placeholder="e.g. ICGC Worship Temple, Asonkore"
                  />
                ) : (
                  <p className="text-xs text-slate-600">{session?.venue || 'Venue Not Set'}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}