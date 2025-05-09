import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Calendar, Clock, Repeat, X } from 'lucide-react';
import { RRule, Weekday, Frequency } from 'rrule';

interface RecurrenceEditorProps {
  value?: string;
  onChange: (rrule: string) => void;
  onClose?: () => void;
}

export default function RecurrenceEditor({ value, onChange, onClose }: RecurrenceEditorProps) {
  const [frequency, setFrequency] = useState<Frequency>(RRule.WEEKLY);
  const [interval, setInterval] = useState(1);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [monthDay, setMonthDay] = useState(1);
  const [endType, setEndType] = useState<'never' | 'after' | 'on'>('never');
  const [endAfter, setEndAfter] = useState(10);
  const [endDate, setEndDate] = useState<string>('');

  const handleFrequencyChange = (newFrequency: Frequency) => {
    setFrequency(newFrequency);
    // Reset related fields
    if (newFrequency === RRule.WEEKLY) {
      setWeekdays([]);
    } else if (newFrequency === RRule.MONTHLY) {
      setMonthDay(1);
    }
  };

  const toggleWeekday = (day: number) => {
    setWeekdays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const generateRRule = () => {
    const options: Partial<RRule.Options> = {
      freq: frequency,
      interval: interval
    };

    if (frequency === RRule.WEEKLY && weekdays.length > 0) {
      options.byweekday = weekdays;
    }

    if (frequency === RRule.MONTHLY) {
      options.bymonthday = monthDay;
    }

    if (endType === 'after') {
      options.count = endAfter;
    } else if (endType === 'on' && endDate) {
      options.until = new Date(endDate);
    }

    const rule = new RRule(options);
    onChange(rule.toString());
  };

  const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recurrence</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeats
            </label>
            <select
              value={frequency}
              onChange={(e) => handleFrequencyChange(Number(e.target.value))}
              className="w-full rounded-md border-gray-300"
            >
              <option value={RRule.DAILY}>Daily</option>
              <option value={RRule.WEEKLY}>Weekly</option>
              <option value={RRule.MONTHLY}>Monthly</option>
              <option value={RRule.YEARLY}>Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat Every
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-20 rounded-md border-gray-300"
              />
              <span className="text-gray-600">
                {frequency === RRule.DAILY && 'days'}
                {frequency === RRule.WEEKLY && 'weeks'}
                {frequency === RRule.MONTHLY && 'months'}
                {frequency === RRule.YEARLY && 'years'}
              </span>
            </div>
          </div>

          {frequency === RRule.WEEKLY && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat On
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdayNames.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => toggleWeekday(index)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      weekdays.includes(index)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === RRule.MONTHLY && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={monthDay}
                onChange={(e) => setMonthDay(Number(e.target.value))}
                className="w-20 rounded-md border-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ends
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={endType === 'never'}
                  onChange={() => setEndType('never')}
                  className="rounded-full border-gray-300"
                />
                <span className="ml-2">Never</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  checked={endType === 'after'}
                  onChange={() => setEndType('after')}
                  className="rounded-full border-gray-300"
                />
                <span className="ml-2">After</span>
                {endType === 'after' && (
                  <input
                    type="number"
                    min="1"
                    value={endAfter}
                    onChange={(e) => setEndAfter(Number(e.target.value))}
                    className="ml-2 w-20 rounded-md border-gray-300"
                  />
                )}
                <span className="ml-2">occurrences</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  checked={endType === 'on'}
                  onChange={() => setEndType('on')}
                  className="rounded-full border-gray-300"
                />
                <span className="ml-2">On</span>
                {endType === 'on' && (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="ml-2 rounded-md border-gray-300"
                  />
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
          )}
          <button
            onClick={generateRRule}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md inline-flex items-center gap-2"
          >
            <Repeat size={16} />
            <span>Apply Recurrence</span>
          </button>
        </div>
      </div>
    </Card>
  );
}