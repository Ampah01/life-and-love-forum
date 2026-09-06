import React, { useState, useEffect } from 'react';
import { FileText, Save, Check } from 'lucide-react';

export default function SessionNotes({ session, onUpdateNotes }) {
  const [notes, setNotes] = useState(session?.notes || '');
  const [savedStatus, setSavedStatus] = useState(false);

  // Keep internal state synced if active session changes
  useEffect(() => {
    setNotes(session?.notes || '');
  }, [session?.id, session?.notes]);

  const handleSave = () => {
    onUpdateNotes(notes);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#1B3B2B]/10 p-2 rounded-xl text-[#1B3B2B]">
            <FileText size={18} />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-sm sm:text-base">Meeting Minutes & Notes</h3>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer ${
            savedStatus 
              ? 'bg-emerald-600 text-white' 
              : 'bg-[#1B3B2B] hover:bg-[#142d21] text-white'
          }`}
        >
          {savedStatus ? <Check size={14} /> : <Save size={14} />}
          {savedStatus ? 'Saved!' : 'Save Notes'}
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down key takeaways, prayer points, action items, or announcements for this session..."
        rows={4}
        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/30 focus:border-[#1B3B2B] transition resize-y text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
}   