import React from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ 
  attendees = [], 
  session = {},
  sessionTitle = '',
  theme = '',
  date = ''
}) {
  const exportToCSV = () => {
    if (!attendees || attendees.length === 0) return;

    // 1. Resolve session metadata checking props or object fallbacks
    const sessionDate = date || session.date || new Date().toISOString().split('T')[0];
    const resolvedTitle = sessionTitle || session.title || session.name || 'Session';
    const resolvedTheme = theme || session.theme || 'No Theme';
    const totalAttendees = attendees.length;

    // 2. Build metadata header rows to include inside the CSV file
    const metaInfo = [
      `"Session Date:","${sessionDate}"\n`,
      `"Session Name:","${resolvedTitle}"\n`,
      `"Session Theme:","${resolvedTheme}"\n`,
      `"Total Attendees:","${totalAttendees}"\n`,
      `\n` // Blank separator row
    ];

    // 3. Table column headers and attendee data rows
    const tableHeaders = ['Name,Phone,Location,Timestamp\n'];
    const rows = attendees.map(
      (a) => `"${a.name || ''}","${a.phone || ''}","${a.location || 'Asonkore'}","${a.timestamp || ''}"\n`
    );

    // 4. Combine everything into a single Blob
    const blob = new Blob([...metaInfo, ...tableHeaders, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    // 5. Format clean safe string for the file name: date_session_theme_total
    const safeDate = sessionDate.replace(/[^a-zA-Z0-9]/g, '_');
    const safeTitle = resolvedTitle.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const safeTheme = resolvedTheme.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    
    const fileName = `${safeDate}_${safeTitle}_${safeTheme}_total_${totalAttendees}.csv`;

    // 6. Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportToCSV}
      disabled={!attendees || attendees.length === 0}
      className="flex items-center gap-1.5 bg-[#B89748] hover:bg-[#a1833c] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
    >
      <Download size={14} /> Export CSV
    </button>
  );
}