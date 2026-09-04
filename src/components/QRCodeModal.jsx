import React from 'react';
import { X, QrCode } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, session }) {
  if (!isOpen || !session) return null;

  // Dynamically uses current domain (localhost during dev, your .vercel.app domain in production)
  const baseUrl = window.location.origin;
  const bookingUrl = `${baseUrl}?booking=true&session=${session.id}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(bookingUrl)}`;

  // Safe formatter for datetime-local strings
  const formatDeadline = (deadlineStr) => {
    if (!deadlineStr) return null;
    try {
      const dateObj = new Date(deadlineStr.replace('T', ' '));
      if (isNaN(dateObj.getTime())) return deadlineStr;
      return dateObj.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return deadlineStr;
    }
  };

  const formattedDeadline = formatDeadline(session.bookingDeadline);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center text-[#1B3B2B]">
          <QrCode size={36} />
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-base">{session.title} - Booking</h3>
          <p className="text-xs text-slate-500 mt-1">
            Scan this unique QR code for <span className="font-semibold text-slate-700">{session.title}</span> to book a seat.
          </p>
          {formattedDeadline && (
            <p className="text-[11px] text-amber-700 bg-amber-50 py-1 px-2 rounded-md mt-2 border border-amber-200">
              ⏳ Deadline: {formattedDeadline}
            </p>    
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-center">
          <img src={qrCodeApiUrl} alt="Session QR Code" className="w-48 h-48 rounded-lg shadow-sm" />
        </div>

        <div>
          <input
            type="text"
            readOnly
            value={bookingUrl}
            className="w-full bg-slate-100 text-[10px] text-slate-600 p-2 rounded-lg border border-slate-200 text-center select-all"
          />
        </div>
      </div>
    </div>
  );
}