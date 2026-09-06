import React from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ attendees, sessionTitle, theme, date }) {
  const handleExport = () => {
    if (!attendees || attendees.length === 0) {
      alert('No attendees to export for this session.');
      return;
    }

    const headers = ['Name', 'Phone', 'Location', 'Status', 'Time'];
    const rows = attendees.map((att) => [
      `"${att.name || ''}"`,
      `"${att.phone || ''}"`,
      `"${att.location || ''}"`,
      `"${att.attended ? 'Present' : 'Absent'}"`,
      `"${att.timestamp || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    
    const safeTitle = (sessionTitle || 'session').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `${safeTitle}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
      title="Export attendance list to CSV"
    >
      <Download size={14} /> Export CSV
    </button>
  );
}