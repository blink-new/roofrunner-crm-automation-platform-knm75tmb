import React from 'react';
import { format } from 'date-fns';

interface AgendaViewProps {
  currentDate: Date;
  onEventClick: (eventId: string) => void;
}

export default function AgendaView({ currentDate, onEventClick }: AgendaViewProps) {
  return (
    <div className="p-6">
      <div className="text-xl font-medium mb-6">
        {format(currentDate, 'MMMM yyyy')}
      </div>
      
      <div className="space-y-4">
        <div className="text-gray-500">No events scheduled</div>
      </div>
    </div>
  );
}