'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function CalendarHeader({ currentMonth, onPrev, onNext }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-2xl font-bold text-slate-800"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.h2>
        </AnimatePresence>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Wall Calendar Edition
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Next Month"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}