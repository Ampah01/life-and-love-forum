import React, { useState } from 'react';

export default function CreateSessionModal({ isOpen, onClose, onCreateSession }) {
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionTheme, setNewSessionTheme] = useState('');
  const [newSessionDeadline, setNewSessionDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const date = new Date().toISOString().split('T')[0];
    onCreateSession({
      title: newSessionTitle.trim(),
      theme: newSessionTheme.trim(),
      date,
      bookingDeadline: newSessionDeadline || null
    });

    // Reset and close
    setNewSessionTitle('');
    setNewSessionTheme('');
    setNewSessionDeadline('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 transform animate-scale-up duration-300">
        <div className="bg-[#1B3B2B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B89748] animate-pulse"></span>
            <h3 className="font-bold text-lg">Create New Session</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] text-slate-800 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Session Theme (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Whole and Ready"
              value={newSessionTheme}
              onChange={(e) => setNewSessionTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] text-slate-800 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Booking Deadline (Date & Time)
            </label>
            <input
              type="datetime-local"
              value={newSessionDeadline}
              onChange={(e) => setNewSessionDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] text-slate-800 text-sm"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold bg-[#1B3B2B] hover:bg-[#12281d] text-white shadow transition-all active:scale-95"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}