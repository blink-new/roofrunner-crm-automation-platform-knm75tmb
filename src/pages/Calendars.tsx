import React, { useState } from 'react';
import { Plus, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import Breadcrumbs from '../components/Navigation/Breadcrumbs';
import CalendarToolbar from '../components/Calendar/CalendarToolbar';
import MonthView from '../components/Calendar/MonthView';
import WeekView from '../components/Calendar/WeekView';
import DayView from '../components/Calendar/DayView';
import AgendaView from '../components/Calendar/AgendaView';
import EventModal from '../components/Calendar/EventModal';
import { ViewMode } from '../types/calendar';

export default function Calendars() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handlePrevious = () => {
    setCurrentDate(prev => {
      switch (viewMode) {
        case 'month':
          return subMonths(prev, 1);
        case 'week':
          return subMonths(prev, 1);
        case 'day':
          return subMonths(prev, 1);
        default:
          return prev;
      }
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      switch (viewMode) {
        case 'month':
          return addMonths(prev, 1);
        case 'week':
          return addMonths(prev, 1);
        case 'day':
          return addMonths(prev, 1);
        default:
          return prev;
      }
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleNewEvent = () => {
    setSelectedEventId(null);
    setShowEventModal(true);
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowEventModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Calendar', path: '/calendar', active: true }
            ]}
          />
          <h1 className="mt-2">Calendar</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
            <span className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>

          <CalendarToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <button
            onClick={handleNewEvent}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 flex-1 min-h-[calc(100vh-200px)]">
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
        {viewMode === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {showEventModal && (
        <EventModal
          eventId={selectedEventId}
          onClose={() => setShowEventModal(false)}
        />
      )}
    </div>
  );
}