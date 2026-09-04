import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function AttendanceTable({ attendees = [], onEditAttendee, onDeleteAttendee }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAllAttendees, setShowAllAttendees] = useState(false);

  const startEditing = (att) => {
    setEditingId(att.id);
    setEditForm({ ...att });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    onEditAttendee(editForm);
    setEditingId(null);
  };

  // Slice attendees to display only 10 unless toggled
  const displayedAttendees = showAllAttendees ? attendees : attendees.slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendees.length > 0 ? (
              displayedAttendees.map((att) => {
                const isEditing = editingId === att.id;

                return (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {att.timestamp || '--:--'}
                    </td>

                    <td className="p-3 font-bold text-slate-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border border-slate-300 rounded p-1 w-full text-xs"
                        />
                      ) : (
                        att.name
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="border border-slate-300 rounded p-1 w-full text-xs"
                        />
                      ) : (
                        att.phone
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="border border-slate-300 rounded p-1 w-full text-xs"
                        />
                      ) : (
                        att.location
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition"
                              title="Save Changes"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded transition"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(att)}
                              className="p-1 text-slate-400 hover:text-[#1B3B2B] hover:bg-slate-100 rounded transition"
                              title="Edit Attendee"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => onDeleteAttendee(att.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete Attendee"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400 italic">
                  No attendees checked in for this session yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show More / Show Less Toggle Button (Set to > 10) */}
      {attendees.length > 10 && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={() => setShowAllAttendees(!showAllAttendees)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B3B2B] hover:text-[#142d21] transition"
          >
            {showAllAttendees ? (
              <>
                <span>Show Less</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Show More ({attendees.length - 10} more attendees)</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}