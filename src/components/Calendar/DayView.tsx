import React from 'react';
import { format } from 'date-fns';

interface DayViewProps {
  currentDate: Date;
  onEventClick: (eventId: string) => void;
}

export default function DayView({ currentDate, onEventClick }: DayViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center p-4 bg-white border-b">
        <div className="font-medium text-gray-500">{format(currentDate, 'EEEE')}</div>
        <div className="text-2xl">{format(currentDate, 'd')}</div>
      </div>

      <div className="flex flex-1">
        {/* Time column */}
        <div className="w-20 bg-white border-r">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 border-b text-right pr-2 text-sm text-gray-500">
              {format(new Date().setHours(i, 0), 'ha')}
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="flex-1 bg-white">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 border-b border-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}