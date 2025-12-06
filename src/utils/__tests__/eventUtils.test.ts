import {
  EVENT_CATEGORY,
  getCategoryColor,
  validateEventTitle,
  validateEventDescription,
} from '../eventUtils';

describe('eventUtils', () => {
  describe('getCategoryColor', () => {
    it('returns blue for work category', () => {
      expect(getCategoryColor(EVENT_CATEGORY.WORK)).toBe('#3b82f6');
    });

    it('returns green for personal category', () => {
      expect(getCategoryColor(EVENT_CATEGORY.PERSONAL)).toBe('#10b981');
    });

    it('returns purple for other category', () => {
      expect(getCategoryColor(EVENT_CATEGORY.OTHER)).toBe('#8b5cf6');
    });

    it('returns default gray for unknown category', () => {
      expect(getCategoryColor('unknown' as any)).toBe('#6b7280');
    });
  });

  describe('validateEventTitle', () => {
    it('returns true for valid title', () => {
      expect(validateEventTitle('Meeting')).toBe(true);
    });

    it('returns false for empty title', () => {
      expect(validateEventTitle('')).toBe(false);
    });

    it('returns false for whitespace only title', () => {
      expect(validateEventTitle('   ')).toBe(false);
    });

    it('returns false for title over 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      expect(validateEventTitle(longTitle)).toBe(false);
    });

    it('returns true for title exactly 100 characters', () => {
      const maxTitle = 'a'.repeat(100);
      expect(validateEventTitle(maxTitle)).toBe(true);
    });
  });

  describe('validateEventDescription', () => {
    it('returns true for valid description', () => {
      expect(validateEventDescription('Team meeting at office')).toBe(true);
    });

    it('returns true for empty description', () => {
      expect(validateEventDescription('')).toBe(true);
    });

    it('returns false for description over 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      expect(validateEventDescription(longDesc)).toBe(false);
    });

    it('returns true for description exactly 500 characters', () => {
      const maxDesc = 'a'.repeat(500);
      expect(validateEventDescription(maxDesc)).toBe(true);
    });
  });
});
