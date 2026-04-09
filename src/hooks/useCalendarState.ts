'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  startOfDay,
} from 'date-fns';

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  content: string;
  start: string;
  end: string;
}

function rangeOverlap(noteStart: Date, noteEnd: Date, selectionStart: Date, selectionEnd: Date) {
  return !(isBefore(noteEnd, selectionStart) || isAfter(noteStart, selectionEnd));
}

export function useCalendarState() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 3, 1)); // Default to April 2026
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Persistence: Load from localStorage
  useEffect(() => {
    const savedRange = localStorage.getItem('calendar_range');
    const savedNotes = localStorage.getItem('calendar_notes');

    if (savedRange) {
      try {
        const parsed = JSON.parse(savedRange);
        setRange({
          start: parsed.start ? new Date(parsed.start) : null,
          end: parsed.end ? new Date(parsed.end) : null,
        });
      } catch (e) {
        console.error('Failed to parse range', e);
      }
    }

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes', e);
      }
    }
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendar_range', JSON.stringify(range));
  }, [range]);

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (range.start && !range.end) {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ ...range, end: date });
      }
    }
  };

  const addNote = (content: string) => {
    if (!range.start || !content.trim()) return;
    const start = startOfDay(range.start);
    const end = range.end ? startOfDay(range.end) : start;

    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto as Crypto).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setNotes(prev => [
      {
        id,
        content: content.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
      },
      ...prev,
    ]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const clearRange = () => setRange({ start: null, end: null });

  const visibleNotes = useMemo(() => {
    if (!range.start) {
      return [];
    }

    const selectionStart = startOfDay(range.start);
    const selectionEnd = startOfDay(range.end ?? range.start);

    return notes.filter(note => {
      const noteStart = startOfDay(new Date(note.start));
      const noteEnd = startOfDay(new Date(note.end));
      return rangeOverlap(noteStart, noteEnd, selectionStart, selectionEnd);
    });
  }, [notes, range]);

  // Get all days for the current grid (including padding from prev/next months)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return {
    currentMonth,
    range,
    hoverDate,
    notes,
    visibleNotes,
    days,
    nextMonth,
    prevMonth,
    handleDateClick,
    setHoverDate,
    addNote,
    updateNote,
    deleteNote,
    clearRange,
    isMounted,
    isSameMonth: (date: Date) => isSameMonth(date, currentMonth),
  };
}