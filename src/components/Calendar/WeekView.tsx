import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface WeekViewProps {
  currentDate: Date;
  onEventClick: (eventId: string) => void;
}

export default function WeekView({ currentDate, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        {/* Time column */}
        <div className="bg-white w-20" />
        
        {/* Day headers */}
        {days.map((day) => (
          <div key={day.toISOString()} className="bg-white p-4 text-center">
            <div className="font-medium text-gray-500">{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="flex-1 grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-white">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 border-b text-right pr-2 text-sm text-gray-500">
              {format(new Date().setHours(i, 0), 'ha')}
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.toISOString()} className="bg-white">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-12 border-b border-gray-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}