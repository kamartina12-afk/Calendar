import { ICalendarEvent, IEventFormData } from "../../../types/event";

export interface IEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: IEventFormData) => void;
  onDelete?: (eventId: string) => void;
  event?: ICalendarEvent | null;
  initialDate?: Date;
}
