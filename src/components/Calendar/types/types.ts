import { ICalendarEvent } from "../../../types/event";

export interface ICalendarProps {
  events?: ICalendarEvent[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}