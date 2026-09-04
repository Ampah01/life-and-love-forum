import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';

export default function RegistrationForm({ onCheckIn, allSessions = [] }) {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getPastAttendees = () => {
    const attendeeMap = new Map();
    allSessions.forEach((session) => {
      session.attendees?.forEach((att) => {
        if (att.name && !attendeeMap.has(att.name.toLowerCase())) {
          attendeeMap.set(att.name.toLowerCase(), att);
        }
      });
    });
    return Array.from(attendeeMap.values());
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));

    if (value.trim().length > 1) {
      const pastAttendees = getPastAttendees();
      const matches = pastAttendees.filter((att) =>
        att.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (attendee) => {
    setFormData({
      name: attendee.name,
      phone: attendee.phone || '',
      location: attendee.location || ''
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    onCheckIn(formData);
    setFormData({ name: '', phone: '', location: '' });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 relative">
      <p className="font-bold text-sm text-slate-700">Attendee Registration</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <input
            type="text"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleNameChange}
            onFocus={() => formData.name.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  className="p-2.5 hover:bg-[#1B3B2B]/5 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.location || 'Asonkore'}</p>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                    <UserCheck size={12} className="text-[#1B3B2B]" /> {item.phone}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="tel"
          required
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]"
        />

        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border border-slate-300 rounded-lg p-2 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]"
        />
      </div>

      <button
        type="submit"
        className="bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-bold px-6 py-2 rounded-lg transition shadow-md"
      >
        Check-In
      </button>
    </form>
  );
}