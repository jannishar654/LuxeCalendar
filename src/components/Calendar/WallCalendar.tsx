'use client';

import { format } from 'date-fns';
import { useCalendarState } from '@/hooks/useCalendarState';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesSection } from './NotesSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function WallCalendar() {
  const {
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
    isSameMonth,
  } = useCalendarState();

  const monthKey = format(currentMonth, 'yyyy-MM');

  return (
    <div className="min-h-screen bg-wallpaper flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className="w-5 h-5 rounded-full bg-slate-900 shadow-[0_0_0_12px_rgba(15,23,42,0.12)] ring-4 ring-slate-100" />
        <div className="mt-2 h-10 w-[2px] bg-slate-300 shadow-lg" />
      </div>

      <div className="relative max-w-6xl w-full flex flex-col shadow-[0_40px_100px_-10px_rgba(0,0,0,0.2)] rounded-3xl overflow-hidden bg-white border border-slate-200 fold-shadow backdrop-blur-sm">
        <div className="relative h-[25vh] md:h-[40vh] overflow-hidden group">
          {isMounted && (
            <motion.img
              key={monthKey}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              src="/assets/hero-main.png"
              alt="Snowy Peaks"
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter opacity-90">
                {format(currentMonth, 'MMMM').toUpperCase()}
              </h1>
              <p className="text-lg font-medium opacity-70 tracking-[0.3em] ml-1">
                {format(currentMonth, 'yyyy')}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 paper-texture pointer-events-none opacity-20" />
          <div className="absolute inset-0 pointer-events-none glitter-effect" />
        </div>

        <div className="h-6 bg-slate-100 flex justify-around items-center px-12 relative z-20 shadow-inner">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none h-2" />
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[1fr_360px] bg-white overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={monthKey}
              initial={{ rotateX: -90, opacity: 0, transformOrigin: 'top' }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex flex-col"
            >
              <CalendarHeader
                currentMonth={currentMonth}
                onPrev={prevMonth}
                onNext={nextMonth}
              />
              <CalendarGrid
                days={days}
                range={range}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onDateHover={setHoverDate}
                isSameMonth={isSameMonth}
                notes={notes}
              />
            </motion.div>
          </AnimatePresence>

          <div className="border-t md:border-t-0">
            <NotesSection
              selectedRange={range}
              visibleNotes={visibleNotes}
              onAddNote={addNote}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
              onClearSelection={clearRange}
            />
          </div>

          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="absolute -bottom-16 right-10 z-0 w-40 h-40 rounded-full bg-blue-200/10 blur-3xl" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08),transparent_30%)] pointer-events-none" />
    </div>
  );
}