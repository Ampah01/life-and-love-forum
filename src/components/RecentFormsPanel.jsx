import React, { useState } from 'react';
import { Plus, Trash2, Edit2, AlertOctagon, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function RecentFormsPanel({
  sessions = [],
  activeSessionId = null,
  setActiveSessionId = () => {},
  onCreateSession = () => {},
  onUpdateSession = () => {},
  onDeleteSession = () => {},
  onClearAll = () => {}
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [showAllSessions, setShowAllSessions] = useState(false);

  // Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'single' | 'all'
    targetId: null,
    targetTitle: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    date: new Date().toISOString().split('T')[0],
    time: 'Every Tuesday, 6:30 PM - 8:00 PM',
    venue: 'ICGC Worship Temple, Asonkore'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      theme: '',
      date: new Date().toISOString().split('T')[0],
      time: 'Every Tuesday, 6:30 PM - 8:00 PM',
      venue: 'ICGC Worship Temple, Asonkore'
    });
    setEditingSessionId(null);
    setShowCreateModal(false);
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingSessionId) {
      onUpdateSession({ ...formData, id: editingSessionId });
    } else {
      onCreateSession(formData);
    }

    resetForm();
  };

  const startEdit = (session) => {
    setEditingSessionId(session.id);
    setFormData({
      title: session.title || '',
      theme: session.theme || '',
      date: session.date || new Date().toISOString().split('T')[0],
      time: session.time || 'Every Tuesday, 6:30 PM - 8:00 PM',
      venue: session.venue || 'ICGC Worship Temple, Asonkore'
    });
    setShowCreateModal(true);
  };

  // Open single session delete confirmation
  const triggerDeleteSession = (session) => {
    setDeleteModal({
      isOpen: true,
      type: 'single',
      targetId: session.id,
      targetTitle: session.title
    });
  };

  // Open clear all confirmation
  const triggerClearAll = () => {
    setDeleteModal({
      isOpen: true,
      type: 'all',
      targetId: null,
      targetTitle: ''
    });
  };

  // Confirm execution handler
  const handleConfirmDelete = () => {
    if (deleteModal.type === 'single' && deleteModal.targetId) {
      onDeleteSession(deleteModal.targetId);
    } else if (deleteModal.type === 'all') {
      onClearAll();
    }
  };

  // Slice sessions to display only 4 unless toggled
  const displayedSessions = showAllSessions ? sessions : sessions.slice(0, 4);

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Program Sessions</h3>
          <button
            onClick={() => {
              if (showCreateModal) {
                resetForm();
              } else {
                resetForm();
                setShowCreateModal(true);
              }
            }}
            className="flex items-center gap-1 bg-[#1B3B2B] text-white text-xs px-2.5 py-1 rounded-lg hover:bg-[#142d21] transition shadow-sm"
          >
            {showCreateModal ? <X size={14} /> : <Plus size={14} />}
            <span>{showCreateModal ? 'Cancel' : 'New Session'}</span>
          </button>
        </div>

        {showCreateModal && (
          <form onSubmit={handleCreateOrUpdate} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <p className="font-bold text-xs text-[#1B3B2B]">
              {editingSessionId ? 'Edit Program Session' : 'Create Program Session'}
            </p>

            <input
              type="text"
              required
              placeholder="Title (e.g. Session 24)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-300 rounded p-1.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Theme (e.g. Whole & Ready)"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full border border-slate-300 rounded p-1.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-slate-300 rounded p-1.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Schedule / Time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full border border-slate-300 rounded p-1.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full border border-slate-300 rounded p-1.5 text-xs focus:border-[#1B3B2B] focus:outline-none"
            />

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-[#1B3B2B] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[#142d21] transition flex items-center justify-center gap-1"
              >
                <Check size={14} />
                <span>{editingSessionId ? 'Update Session' : 'Save Session'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-3 bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {sessions && sessions.length > 0 ? (
            <>
              {displayedSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex justify-between items-start gap-2 ${
                    session.id === activeSessionId
                      ? 'border-[#1B3B2B] bg-[#1B3B2B]/5 font-semibold text-[#1B3B2B]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold">{session.title}</p>
                    <p className="text-[10px] text-amber-700 font-medium">{session.theme || 'No Theme'}</p>
                    <p className="text-[10px] text-slate-500">📅 {session.date || 'No Date Set'}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(session);
                      }}
                      className="p-1 text-slate-400 hover:text-[#1B3B2B] hover:bg-slate-100 rounded transition"
                      title="Edit Session"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDeleteSession(session);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete Session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {sessions.length > 4 && (
                <button
                  onClick={() => setShowAllSessions(!showAllSessions)}
                  className="w-full py-1.5 text-xs font-semibold text-[#1B3B2B] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition"
                >
                  {showAllSessions ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      <span>Show More ({sessions.length - 4} older)</span>
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">No sessions created yet.</p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={triggerClearAll}
            className="w-full flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold py-2 rounded-lg transition"
          >
            <AlertOctagon size={14} /> Clear All Sessions Data
          </button>
        </div>
      </div>

      {/* Render Reusable Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'all' ? "Clear All Sessions" : "Delete Session"}
        message={
          deleteModal.type === 'all'
            ? "Are you sure you want to delete ALL sessions and reset your attendance logs? This action cannot be undone."
            : `Are you sure you want to delete "${deleteModal.targetTitle}"? All attendees logged under this session will be permanently removed.`
        }
        confirmLabel={deleteModal.type === 'all' ? "Clear All" : "Delete Session"}
      />
    </>
  );
}