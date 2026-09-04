import React from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ attendees, sessionTitle }) {
  const exportToCSV = () => {
    if (!attendees || attendees.length === 0) return;

    const headers = ['Name,Phone,Location,Timestamp\n'];
    const rows = attendees.map(
      (a) => `"${a.name}","${a.phone}","${a.location || 'Asonkore'}","${a.timestamp}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionTitle.toLowerCase().replace(/\s+/g, '_')}_attendance.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={!attendees || attendees.length === 0}
      className="flex items-center gap-1.5 bg-[#B89748] hover:bg-[#a1833c] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
    >
      <Download size={14} /> Export CSV
    </button>
  );
}