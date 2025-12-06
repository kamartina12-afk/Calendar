export interface ICalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: Date;
  time: string; // HH:MM format
  notificationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventFormData {
  title: string;
  date: Date;
  time: string;
  notificationEnabled: boolean;
}

export type ViewMode = 'month' | 'day';
