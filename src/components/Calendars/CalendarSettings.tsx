import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Plus, Users, Calendar, Box, Edit2, Trash2 } from 'lucide-react';

interface Calendar {
  id: string;
  name: string;
  type: 'personal' | 'collective' | 'resource';
  owner_id: string;
  team_members?: string[];
  timezone: string;
  working_hours: {
    day: number;
    start: string;
    end: string;
  }[];
}

export default function CalendarSettings() {
  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: '1',
      name: 'My Calendar',
      type: 'personal',
      owner_id: 'user1',
      timezone: 'America/New_York',
      working_hours: [
        { day: 1, start: '09:00', end: '17:00' },
        { day: 2, start: '09:00', end: '17:00' },
        { day: 3, start: '09:00', end: '17:00' },
        { day: 4, start: '09:00', end: '17:00' },
        { day: 5, start: '09:00', end: '17:00' }
      ]
    },
    {
      id: '2',
      name: 'Sales Team',
      type: 'collective',
      owner_id: 'user1',
      team_members: ['user1', 'user2', 'user3'],
      timezone: 'America/New_York',
      working_hours: [
        { day: 1, start: '09:00', end: '17:00' },
        { day: 2, start: '09:00', end: '17:00' },
        { day: 3, start: '09:00', end: '17:00' },
        { day: 4, start: '09:00', end: '17:00' },
        { day: 5, start: '09:00', end: '17:00' }
      ]
    }
  ]);

  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);

  const getTypeIcon = (type: Calendar['type']) => {
    switch (type) {
      case 'personal':
        return Calendar;
      case 'collective':
        return Users;
      case 'resource':
        return Box;
      default:
        return Calendar;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Calendars</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Calendar</span>
          </button>
        </div>

        <div className="space-y-4">
          {calendars.map(calendar => {
            const TypeIcon = getTypeIcon(calendar.type);
            
            return (
              <div
                key={calendar.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TypeIcon size={20} className="text-primary-500" />
                    <div>
                      <h4 className="font-medium">{calendar.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {calendar.type} Calendar • {calendar.timezone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCalendar(calendar)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {calendar.type === 'collective' && calendar.team_members && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Team Members</h5>
                    <div className="flex flex-wrap gap-2">
                      {calendar.team_members.map(member => (
                        <span
                          key={member}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Working Hours</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {calendar.working_hours.map(hours => (
                      <div key={hours.day} className="flex justify-between">
                        <span className="text-gray-600">
                          {new Date(2024, 0, hours.day).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <span className="text-gray-900">
                          {hours.start} - {hours.end}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}