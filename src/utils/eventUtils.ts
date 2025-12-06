export const EVENT_CATEGORY = {
  WORK: 'work',
  PERSONAL: 'personal',
  OTHER: 'other',
} as const;

export type EventCategory = typeof EVENT_CATEGORY[keyof typeof EVENT_CATEGORY];

export const getCategoryColor = (category: EventCategory): string => {
  switch (category) {
    case EVENT_CATEGORY.WORK:
      return '#3b82f6';
    case EVENT_CATEGORY.PERSONAL:
      return '#10b981';
    case EVENT_CATEGORY.OTHER:
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

export const validateEventTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};

export const validateEventDescription = (description: string): boolean => {
  return description.length <= 500;
};
