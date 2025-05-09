import React, { useState } from 'react';
import { Calendar, Clock, Repeat } from 'lucide-react';

interface ScheduleSettingsProps {
  schedule: {
    type: 'now' | 'later' | 'recurring';
    sendAt?: string;
    recurrence?: string;
  };
  onChange: (schedule: {
    type: 'now' | 'later' | 'recurring';
    sendAt?: string;
    recurrence?: string;
  }) => void;
  onSchedule: () => void;
}

export default function ScheduleSettings({
  schedule,
  onChange,
  onSchedule
}: ScheduleSettingsProps) {
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...schedule,
      sendAt: e.target.value
    });
  };

  const handleTypeChange = (type: 'now' | 'later' | 'recurring') => {
    onChange({
      type,
      sendAt: type !== 'now' ? schedule.sendAt : undefined,
      recurrence: type === 'recurring' ? schedule.recurrence : undefined
    });

    if (type === 'recurring') {
      setShowRecurrenceOptions(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Schedule Campaign</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                checked={schedule.type === 'now'}
                onChange={() => handleTypeChange('now')}
                className="rounded-full border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Send immediately
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="radio"
                checked={schedule.type === 'later'}
                onChange={() => handleTypeChange('later')}
                className="rounded-full border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Schedule for later
              </span>
            </label>
            {schedule.type === 'later' && (
              <div className="mt-2 ml-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 rounded-md border-gray-300"
                        value={schedule.sendAt?.split('T')[0] || ''}
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        className="w-full pl-10 rounded-md border-gray-300"
                        value={schedule.sendAt?.split('T')[1]?.substring(0, 5) || ''}
                        onChange={(e) => {
                          const date = schedule.sendAt?.split('T')[0] || new Date().toISOString().split('T')[0];
                          onChange({
                            ...schedule,
                            sendAt: `${date}T${e.target.value}:00`
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="radio"
                checked={schedule.type === 'recurring'}
                onChange={() => handleTypeChange('recurring')}
                className="rounded-full border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Set up recurring schedule
              </span>
            </label>
            {schedule.type === 'recurring' && (
              <div className="mt-2 ml-6">
                <button
                  onClick={() => setShowRecurrenceOptions(true)}
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Repeat size={14} />
                  <span>Configure Recurrence</span>
                </button>
                {schedule.recurrence && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    {schedule.recurrence}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {(schedule.type === 'later' || schedule.type === 'recurring') && (
        <div>
          <h3 className="text-lg font-medium mb-4">Delivery Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select className="w-full rounded-md border-gray-300">
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
                <option>Pacific Time (PT)</option>
              </select>
            </div>

            {schedule.type === 'recurring' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    className="w-24 rounded-md border-gray-300"
                    placeholder="100"
                    min="1"
                  />
                  <select className="rounded-md border-gray-300">
                    <option>recipients per hour</option>
                    <option>recipients per day</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Limit sending rate to avoid delivery issues
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onSchedule}
          className="btn btn-primary inline-flex items-center gap-2"
          disabled={schedule.type !== 'now' && !schedule.sendAt}
        >
          <Clock size={16} />
          <span>Schedule Campaign</span>
        </button>
      </div>

      {showRecurrenceOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Recurrence Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select className="w-full rounded-md border-gray-300">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Every
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="w-20 rounded-md border-gray-300"
                    min="1"
                    defaultValue="1"
                  />
                  <span>week(s)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  On These Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starts On
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ends
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ends"
                      className="rounded-full border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">Never</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ends"
                      className="rounded-full border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">After</span>
                    <input
                      type="number"
                      className="ml-2 w-16 rounded-md border-gray-300"
                      min="1"
                      defaultValue="10"
                    />
                    <span className="ml-2 text-sm text-gray-700">occurrences</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="ends"
                      className="rounded-full border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">On</span>
                    <input
                      type="date"
                      className="ml-2 rounded-md border-gray-300"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRecurrenceOptions(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onChange({
                    ...schedule,
                    recurrence: 'Weekly on Monday, Wednesday, Friday'
                  });
                  setShowRecurrenceOptions(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}