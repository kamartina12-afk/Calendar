/**
 * @format
 */

import { formatDate, getDaysInMonth } from '../src/utils/dateUtils';

describe('App', () => {
  test('dateUtils work correctly', () => {
    const date = new Date(2025, 11, 6);
    expect(formatDate(date)).toBe('2025-12-06');
    expect(getDaysInMonth(11, 2025)).toBe(31);
  });
});
