export type ViewMode = 'month' | 'week' | 'day' | 'agenda';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  attendees?: string[];
  recurrence?: string;
  reminders?: string[];
  color?: string;
  contactId?: string;
  dealId?: string;
}

export interface EventType {
  id: string;
  name: string;
  duration: number;
  color: string;
  description?: string;
  instructions?: string;
  bufferBefore?: number;
  bufferAfter?: number;
}

export interface Availability {
  userId: string;
  workingHours: {
    day: number;
    start: string;
    end: string;
  }[];
  unavailable: {
    start: Date;
    end: Date;
    reason?: string;
  }[];
  timezone: string;
}

export interface BookingLink {
  id: string;
  userId: string;
  eventTypeId?: string;
  name: string;
  slug: string;
  active: boolean;
}