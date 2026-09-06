import React, { useState } from 'react';
import { UserPlus, User, Phone, MapPin, Calendar } from 'lucide-react';

export default function RegistrationForm({ onCheckIn, allSessions }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter both name and phone number.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');

    const targetId = selectedSessionId || undefined;
    const result = await onCheckIn({ name, phone, location }, targetId);

    if (result && result.success === false) {
      alert(result.message); // Displays the duplicate warning alert
    } else {
      setSuccessMsg('Successfully checked in!');
      setName('');
      setPhone('');
      setLocation('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#1B3B2B]/10 p-2 rounded-xl text-[#1B3B2B]">
            <UserPlus size={18} />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-sm sm:text-base">Quick Attendee Registration</h3>
        </div>
        {successMsg && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-pulse">
            {successMsg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <User size={15} />
          </span>
          <input
            type="text"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/30 focus:border-[#1B3B2B] transition text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Phone size={15} />
          </span>
          <input
            type="tel"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/30 focus:border-[#1B3B2B] transition text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <MapPin size={15} />
          </span>
          <input
            type="text"
            placeholder="Location / Residence"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/30 focus:border-[#1B3B2B] transition text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {allSessions && allSessions.length > 1 ? (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Calendar size={15} />
            </span>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]/30 focus:border-[#1B3B2B] transition text-slate-700 cursor-pointer"
            >
              <option value="">Active Session (Default)</option>
              {allSessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.date})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus size={16} /> Register Attendee
          </button>
        )}
      </div>

      {allSessions && allSessions.length > 1 && (
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs sm:text-sm font-semibold py-2 px-6 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <UserPlus size={16} /> Register Attendee
          </button>
        </div>
      )}
    </form>
  );
}