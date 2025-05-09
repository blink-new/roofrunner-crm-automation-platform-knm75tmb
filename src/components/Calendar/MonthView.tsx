import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

interface MonthViewProps {
  currentDate: Date;
  onEventClick: (eventId: string) => void;
}

export default function MonthView({ currentDate, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {/* Week day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="bg-white p-4 text-center font-medium text-gray-500">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`bg-white p-4 min-h-[120px] ${
            isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <span className="font-medium">{format(day, 'd')}</span>
        </div>
      ))}
    </div>
  );
}