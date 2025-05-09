import React from 'react';
import { ViewMode } from '../../types/calendar';

interface CalendarToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function CalendarToolbar({
  viewMode,
  onViewModeChange
}: CalendarToolbarProps) {
  const views: { id: ViewMode; label: string }[] = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'agenda', label: 'Agenda' }
  ];

  return (
    <div className="flex rounded-md shadow-sm">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewModeChange(view.id)}
          className={`
            px-4 py-2 text-sm font-medium
            ${view.id === viewMode
              ? 'bg-primary-50 text-primary-700 border-primary-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
            border
            ${views[0].id === view.id ? 'rounded-l-md' : ''}
            ${views[views.length - 1].id === view.id ? 'rounded-r-md' : ''}
            ${view.id !== views[0].id ? '-ml-px' : ''}
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}