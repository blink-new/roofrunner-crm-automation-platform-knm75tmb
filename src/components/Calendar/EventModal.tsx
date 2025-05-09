import React, { useState } from 'react';
import { X, Users, MapPin, Clock, Repeat, Bell } from 'lucide-react';
import { Card } from '../ui/card';

interface EventModalProps {
  eventId: string | null;
  onClose: () => void;
}

export default function EventModal({ eventId, onClose }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    location: '',
    attendees: '',
    recurrence: 'none',
    reminders: ['30']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {eventId ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Add title"
              className="w-full text-xl font-medium border-0 border-b-2 border-gray-200 focus:border-primary-500 focus:ring-0 pb-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 rounded-md border-gray-300"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <input
                  type="time"
                  className="rounded-md border-gray-300"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 rounded-md border-gray-300"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <input
                  type="time"
                  className="rounded-md border-gray-300"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">All day</span>
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <MapPin size={16} />
              <label className="text-sm font-medium">Location</label>
            </div>
            <input
              type="text"
              placeholder="Add location"
              className="w-full rounded-md border-gray-300"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <Users size={16} />
              <label className="text-sm font-medium">Attendees</label>
            </div>
            <input
              type="text"
              placeholder="Add attendees"
              className="w-full rounded-md border-gray-300"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <Repeat size={16} />
              <label className="text-sm font-medium">Recurrence</label>
            </div>
            <select
              className="w-full rounded-md border-gray-300"
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom...</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <Bell size={16} />
              <label className="text-sm font-medium">Reminders</label>
            </div>
            <select
              multiple
              className="w-full rounded-md border-gray-300"
              value={formData.reminders}
              onChange={(e) => setFormData({
                ...formData,
                reminders: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              <option value="0">At time of event</option>
              <option value="5">5 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border-gray-300"
              placeholder="Add description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {eventId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}