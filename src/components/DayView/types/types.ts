import { ICalendarEvent } from "../../../types/event";

export interface IDayViewProps {
  events: ICalendarEvent[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventPress?: (event: ICalendarEvent) => void;
}