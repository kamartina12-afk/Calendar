import {
  formatDate,
  formatDateKey,
  formatTime,
  formatDayMonth,
  getDaysInMonth,
  isLeapYear,
  getFirstDayOfMonth,
  isSameDay,
  isDayToday,
  isDaySelected,
  dayHasEvent,
  createEventDateSet,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date(2025, 11, 6);
      expect(formatDate(date)).toBe('2025-12-06');
    });

    it('pads single digit day and month', () => {
      const date = new Date(2025, 0, 5);
      expect(formatDate(date)).toBe('2025-01-05');
    });
  });

  describe('formatDateKey', () => {
    it('formats date key as ISO string', () => {
      const date = new Date(2025, 11, 6);
      const result = formatDateKey(date);
      expect(result).toMatch(/2025-12-0[56]/);
    });
  });

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const date = new Date(2025, 11, 6, 14, 30);
      expect(formatTime(date)).toBe('14:30');
    });

    it('pads single digit hours and minutes', () => {
      const date = new Date(2025, 11, 6, 9, 5);
      expect(formatTime(date)).toBe('09:05');
    });
  });

  describe('formatDayMonth', () => {
    it('formats day and month with weekday', () => {
      const date = new Date(2025, 11, 6);
      const result = formatDayMonth(date);
      expect(result).toContain('December');
      expect(result).toContain('6');
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 31 days for December', () => {
      expect(getDaysInMonth(11, 2025)).toBe(31);
    });

    it('returns 30 days for November', () => {
      expect(getDaysInMonth(10, 2025)).toBe(30);
    });

    it('returns 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(1, 2025)).toBe(28);
    });

    it('returns 29 days for February in leap year', () => {
      expect(getDaysInMonth(1, 2024)).toBe(29);
    });
  });

  describe('isLeapYear', () => {
    it('returns true for leap year divisible by 4', () => {
      expect(isLeapYear(2024)).toBe(true);
    });

    it('returns false for non-leap year', () => {
      expect(isLeapYear(2025)).toBe(false);
    });

    it('returns false for year divisible by 100 but not 400', () => {
      expect(isLeapYear(1900)).toBe(false);
    });

    it('returns true for year divisible by 400', () => {
      expect(isLeapYear(2000)).toBe(true);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('returns correct first day of month', () => {
      const firstDay = getFirstDayOfMonth(11, 2025);
      expect(firstDay).toBeGreaterThanOrEqual(0);
      expect(firstDay).toBeLessThan(7);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same date', () => {
      const date1 = new Date(2025, 11, 6);
      const date2 = new Date(2025, 11, 6);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different dates', () => {
      const date1 = new Date(2025, 11, 6);
      const date2 = new Date(2025, 11, 7);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for same day but different month', () => {
      const date1 = new Date(2025, 11, 6);
      const date2 = new Date(2025, 10, 6);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isDayToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      const result = isDayToday(
        today.getDate(),
        today.getMonth(),
        today.getFullYear(),
        today
      );
      expect(result).toBe(true);
    });

    it('returns false for different day', () => {
      const today = new Date();
      const result = isDayToday(1, 0, 2020, today);
      expect(result).toBe(false);
    });
  });

  describe('isDaySelected', () => {
    it('returns true for selected date', () => {
      const selected = new Date(2025, 11, 6);
      expect(isDaySelected(6, 11, 2025, selected)).toBe(true);
    });

    it('returns false for different date', () => {
      const selected = new Date(2025, 11, 6);
      expect(isDaySelected(7, 11, 2025, selected)).toBe(false);
    });
  });

  describe('dayHasEvent', () => {
    it('returns true if day has event', () => {
      const eventDates = new Set(['2025-12-06', '2025-12-15']);
      expect(dayHasEvent(6, 11, 2025, eventDates)).toBe(true);
    });

    it('returns false if day has no event', () => {
      const eventDates = new Set(['2025-12-06', '2025-12-15']);
      expect(dayHasEvent(7, 11, 2025, eventDates)).toBe(false);
    });
  });

  describe('createEventDateSet', () => {
    it('creates set from event dates', () => {
      const events = [
        { date: new Date(2025, 11, 6) },
        { date: new Date(2025, 11, 15) },
      ];
      const result = createEventDateSet(events);
      expect(result.size).toBe(2);
      expect(result.has('2025-12-06')).toBe(true);
      expect(result.has('2025-12-15')).toBe(true);
    });

    it('returns empty set for no events', () => {
      const result = createEventDateSet([]);
      expect(result.size).toBe(0);
    });
  });
});
