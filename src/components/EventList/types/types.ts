import { ICalendarEvent } from "../../../types/event";

export interface IEventListProps {
  events: ICalendarEvent[];
  onEventPress?: (event: ICalendarEvent) => void;
  emptyMessage?: string;
}