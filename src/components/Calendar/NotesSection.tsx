'use client';

import { format } from 'date-fns';
import { FileText, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { CalendarNote, CalendarRange } from '@/hooks/useCalendarState';

interface NotesSectionProps {
  selectedRange: CalendarRange;
  visibleNotes: CalendarNote[];
  onAddNote: (content: string) => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onClearSelection: () => void;
}

export function NotesSection({
  selectedRange,
  visibleNotes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onClearSelection,
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!selectedRange.start) {
      setNewNote('');
    }
  }, [selectedRange]);

  const rangeLabel = useMemo(() => {
    if (!selectedRange.start) {
      return null;
    }

    if (!selectedRange.end) {
      return format(selectedRange.start, 'do MMMM yyyy');
    }

    return `${format(selectedRange.start, 'do MMMM yyyy')} — ${format(selectedRange.end, 'do MMMM yyyy')}`;
  }, [selectedRange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote('');
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md p-6 border-l border-slate-200/50 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-slate-700">
        <FileText className="w-5 h-5 text-blue-500" />
        <div>
          <h3 className="font-bold text-lg">Notes & Ranges</h3>
          <p className="text-sm text-slate-500">Add notes for a selected day or date range.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm mb-4">
        {selectedRange.start ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected period</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{rangeLabel}</p>
              </div>
              <button
                type="button"
                onClick={onClearSelection}
                className="text-xs uppercase tracking-[0.3em] text-slate-500 hover:text-slate-700 transition"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Notes created here will be attached to the selected day or range. Overlapping dates are included automatically.
            </p>
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            <p className="font-medium text-slate-700 mb-2">Pick a date or drag across a range.</p>
            <p>Notes will surface when your selection overlaps stored note intervals.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="text-sm font-semibold text-slate-700 mb-2 block">New note</label>
        <textarea
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
          placeholder={selectedRange.start ? 'Write a note for the selected day or date range...' : 'Select a date before writing a note.'}
          disabled={!selectedRange.start}
          className="w-full min-h-[140px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={!selectedRange.start || !newNote.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add note
          </button>
          <span className="text-xs text-slate-400 uppercase tracking-[0.2em]">Auto saved</span>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {selectedRange.start && visibleNotes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            No notes found for this selection yet. Add one to start tracking your date range.
          </div>
        )}

        {visibleNotes.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Note range</p>
                <p className="text-sm font-semibold text-slate-800">
                  {note.start === note.end
                    ? format(new Date(note.start), 'do MMMM yyyy')
                    : `${format(new Date(note.start), 'do MMM yyyy')} — ${format(new Date(note.end), 'do MMM yyyy')}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteNote(note.id)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={note.content}
              onChange={event => onUpdateNote(note.id, event.target.value)}
              className="mt-3 w-full min-h-[100px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}