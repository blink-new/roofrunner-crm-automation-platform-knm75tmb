import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Plus, Edit2, Trash2, Users, Box, Clock } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: 'room' | 'equipment';
  capacity?: number;
  location?: string;
  description?: string;
  availability: {
    days: number[];
    start_time: string;
    end_time: string;
  };
  features: string[];
  status: 'available' | 'maintenance' | 'inactive';
}

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Conference Room A',
      type: 'room',
      capacity: 12,
      location: 'First Floor',
      description: 'Large conference room with projector',
      availability: {
        days: [1, 2, 3, 4, 5],
        start_time: '09:00',
        end_time: '17:00'
      },
      features: ['Projector', 'Whiteboard', 'Video Conference'],
      status: 'available'
    },
    {
      id: '2',
      name: 'Portable Projector',
      type: 'equipment',
      description: 'HD Projector with HDMI and USB-C',
      availability: {
        days: [1, 2, 3, 4, 5],
        start_time: '09:00',
        end_time: '17:00'
      },
      features: ['HDMI', 'USB-C', 'Wireless'],
      status: 'available'
    }
  ]);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Rooms & Resources</h3>
          <button className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={16} />
            <span>Add Resource</span>
          </button>
        </div>

        <div className="space-y-4">
          {rooms.map(room => (
            <div
              key={room.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {room.type === 'room' ? (
                    <Users size={20} className="text-primary-500" />
                  ) : (
                    <Box size={20} className="text-primary-500" />
                  )}
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-gray-500">
                      {room.type === 'room' ? `Capacity: ${room.capacity}` : room.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingRoom(room)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Features</h5>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map(feature => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Availability</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>
                        {room.availability.start_time} - {room.availability.end_time}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {weekdays.map((day, index) => (
                        <span
                          key={day}
                          className={`px-1.5 py-0.5 rounded text-xs ${
                            room.availability.days.includes(index + 1)
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
                {room.type === 'room' && room.location && (
                  <span className="text-sm text-gray-500">
                    Location: {room.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}