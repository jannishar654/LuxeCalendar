'use client';

import {
  format,
  isSameDay,
  isWithinInterval,
  isToday,
  startOfDay,
  isBefore,
  isAfter,
} from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarNote {
  start: string;
  end: string;
}


interface CalendarGridProps {
  days: Date[];
  range: { start: Date | null; end: Date | null };
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  isSameMonth: (date: Date) => boolean;
  notes: CalendarNote[];
}

const MOCK_HOLIDAYS: Record<string, string> = {
  '01-01': "New Year's Day",
  '02-14': "Valentine's Day",
  '03-17': "St. Patrick's Day",
  '04-22': "Earth Day",
  '07-04': "Independence Day",
  '10-31': "Halloween",
  '12-25': "Christmas",
};

export function CalendarGrid({
  days,
  range,
  hoverDate,
  onDateClick,
  onDateHover,
  isSameMonth,
  notes,
}: CalendarGridProps) {

  const noteRanges = notes.map(note => ({
    start: new Date(note.start),
    end: new Date(note.end),
  }));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayStatus = (date: Date) => {
    const isStart = range.start && isSameDay(date, range.start);
    const isEnd = range.end && isSameDay(date, range.end);

    let isInRange = false;
    if (range.start && range.end) {
      isInRange = isWithinInterval(date, {
        start: startOfDay(range.start),
        end: startOfDay(range.end)
      });
    } else if (range.start && hoverDate) {
      const rangeStart = isBefore(hoverDate, range.start) ? hoverDate : range.start;
      const rangeEnd = isBefore(hoverDate, range.start) ? range.start : hoverDate;
      isInRange = isWithinInterval(date, {
        start: startOfDay(rangeStart),
        end: startOfDay(rangeEnd),
      });
    }

    return { isStart, isEnd, isInRange };
  };

  const hasNoteForDate = (date: Date) => {
    return noteRanges.some(({ start, end }) => {
      const normalizedDate = startOfDay(date);
      return !isBefore(end, normalizedDate) && !isAfter(start, normalizedDate);
    });
  };



  return (
    <div className="p-4 bg-white paper-texture">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map(date => {
          const { isStart, isEnd, isInRange } = getDayStatus(date);
          const holiday = MOCK_HOLIDAYS[format(date, 'MM-dd')];
          const isCurrentMonth = isSameMonth(date);
          const isTodayDate = isToday(date);
          const hasNote = hasNoteForDate(date);

          return (
            <div
              key={date.toISOString()}
              className="relative aspect-square p-1"
              onMouseEnter={() => onDateHover(date)}
              onMouseLeave={() => onDateHover(null)}
            >
              <button
                onClick={() => onDateClick(date)}
                className={cn(
                  'w-full h-full flex flex-col items-center justify-center rounded-lg transition-all duration-200 relative z-10',
                  !isCurrentMonth && 'text-slate-300',
                  isCurrentMonth && 'text-slate-700 hover:bg-slate-100',
                  isInRange && 'bg-blue-50/80 text-blue-700',
                  (isStart || isEnd) && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg scale-105',
                  isTodayDate && !isStart && !isEnd && 'border-2 border-blue-200'
                )}
              >

                <span className={cn('text-sm font-semibold', (isStart || isEnd) && 'text-white')}>
                  {format(date, 'd')}
                </span>

                {holiday && (
                  <div
                    className={cn(
                      'absolute bottom-2 w-1 h-1 rounded-full',
                      (isStart || isEnd) ? 'bg-white/60' : 'bg-red-400'
                    )}
                    title={holiday}
                  />
                )}
              </button>

              {hasNote && (
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-amber-400 shadow-glow" />
              )}
              {isInRange && !isStart && !isEnd && <div className="absolute inset-0 bg-blue-50/80 -z-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
