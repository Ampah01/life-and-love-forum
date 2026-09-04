import React from 'react';
import PublicBooking from './PublicBooking';
import Footer from './Footer';

export default function PublicBookingRoute() {
  const urlParams = new URLSearchParams(window.location.search);
  const isBookingView = urlParams.get('booking') === 'true';
  const targetSessionId = urlParams.get('session');

  if (!isBookingView || !targetSessionId) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      <div className="py-10 px-4 max-w-lg mx-auto w-full">
        <PublicBooking sessionId={targetSessionId} />
      </div>
      <Footer />
    </div>
  );
}