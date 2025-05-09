import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function EventsWidget() {
  const events = [
    {
      id: '1',
      title: 'Client Meeting',
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Site Inspection',
      time: '2:00 PM',
      type: 'inspection'
    },
    {
      id: '3',
      title: 'Team Sync',
      time: '4:30 PM',
      type: 'internal'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar size={16} />
        <span>Today's Schedule</span>
      </div>

      <div className="space-y-3">
        {events.map(event => (
          <div
            key={event.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm font-medium">{event.time}</span>
            </div>
            <div className="flex-[2]">
              <div className="text-sm font-medium">{event.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}