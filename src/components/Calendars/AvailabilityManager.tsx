import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Plus, Clock, Trash2, Calendar } from 'lucide-react';

interface TimeSlot {
  id: string;
  days: number[];
  start_time: string;
  end_time: string;
  type: 'available' | 'unavailable';
}

interface AvailabilityManagerProps {
  slots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

export default function AvailabilityManager({ slots, onChange }: AvailabilityManagerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(slots);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: crypto.randomUUID(),
      days: [1, 2, 3, 4, 5], // Monday to Friday
      start_time: '09:00',
      end_time: '17:00',
      type: 'available'
    };
    const updatedSlots = [...timeSlots, newSlot];
    setTimeSlots(updatedSlots);
    onChange(updatedSlots);
  };

  const removeTimeSlot = (id: string) => {
    const updatedSlots = timeSlots.filter(slot => slot.id !== id);
    setTimeSlots(updatedSlots);
    onChange(updatedSlots);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    const updatedSlots = timeSlots.map(slot =>
      slot.id === id ? { ...slot, ...updates } : slot
    );
    setTimeSlots(updatedSlots);
    onChange(updatedSlots);
  };

  const toggleDay = (slotId: string, day: number) => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (!slot) return;

    const updatedDays = slot.days.includes(day)
      ? slot.days.filter(d => d !== day)
      : [...slot.days, day];

    updateTimeSlot(slotId, { days: updatedDays });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Availability</h3>
          <button
            onClick={addTimeSlot}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Time Slot</span>
          </button>
        </div>

        <div className="space-y-4">
          {timeSlots.map(slot => (
            <div
              key={slot.id}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-primary-500" />
                  <div>
                    <h4 className="font-medium">Time Slot</h4>
                    <p className="text-sm text-gray-500">
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={slot.type}
                    onChange={(e) => updateTimeSlot(slot.id, {
                      type: e.target.value as 'available' | 'unavailable'
                    })}
                    className="rounded-md border-gray-300 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <button
                    onClick={() => removeTimeSlot(slot.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => updateTimeSlot(slot.id, {
                      start_time: e.target.value
                    })}
                    className="rounded-md border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => updateTimeSlot(slot.id, {
                      end_time: e.target.value
                    })}
                    className="rounded-md border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(slot.id, index + 1)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        slot.days.includes(index + 1)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {timeSlots.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No time slots defined
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}