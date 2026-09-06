import React, { useState } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';

export default function WhatsAppReminderButton({ session }) {
  const [copied, setCopied] = useState(false);

  const attendees = session?.attendees || [];
  const validPhones = attendees
    .map((a) => a.phone)
    .filter((phone) => phone && phone.trim() !== '' && phone !== 'N/A');

  const count = validPhones.length;

  const handleBroadcast = () => {
    const title = session?.title || 'our session';
    const theme = session?.theme || '';
    const text = `Hello! Thank you for participating in *${title}* ${theme ? `(Theme: ${theme})` : ''}. We hope you were richly blessed! Looking forward to seeing you at our next forum. 🙏✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyNumbers = () => {
    if (count === 0) return;
    const phoneList = validPhones.join(', ');
    navigator.clipboard.writeText(phoneList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleBroadcast}
        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
        title="Open WhatsApp Broadcast draft"
      >
        <MessageSquare size={14} /> WhatsApp
      </button>

      <button
        type="button"
        onClick={handleCopyNumbers}
        disabled={count === 0}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm whitespace-nowrap ${
          count === 0 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : copied 
              ? 'bg-emerald-600 text-white cursor-pointer' 
              : 'bg-slate-700 hover:bg-slate-800 text-white cursor-pointer'
        }`}
        title="Copy all attendee phone numbers"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : `Copy Nos (${count})`}
      </button>
    </div>
  );
}