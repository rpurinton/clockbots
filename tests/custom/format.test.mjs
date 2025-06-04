import { getOffsetStr, formatFullTime, formatShortTime } from '../../src/custom/format.mjs';
import moment from 'moment-timezone';

describe('getOffsetStr', () => {
  test('returns GMT+0 for UTC', () => {
    expect(getOffsetStr('2025-06-03T12:00:00Z', 'UTC')).toBe('GMT+0');
  });
  test('returns GMT+2 for Europe/Berlin in summer', () => {
    expect(getOffsetStr('2025-06-03T12:00:00Z', 'Europe/Berlin')).toBe('GMT+2');
  });
  test('returns GMT-5 for America/New_York in summer', () => {
    expect(getOffsetStr('2025-06-03T12:00:00Z', 'America/New_York')).toBe('GMT-4');
  });
  test('returns GMT+5:30 for Asia/Kolkata', () => {
    expect(getOffsetStr('2025-06-03T12:00:00Z', 'Asia/Kolkata')).toBe('GMT+5:30');
  });
});

describe('formatFullTime', () => {
  test('formats full time string in UTC', () => {
    expect(formatFullTime('2025-06-03T12:00:00Z', 'UTC')).toMatch(/Tuesday June 3rd, 2025 12:00 UTC/);
  });
  test('formats full time string in Europe/Berlin', () => {
    expect(formatFullTime('2025-06-03T12:00:00Z', 'Europe/Berlin')).toMatch(/Tuesday June 3rd, 2025 14:00 CEST/);
  });
});

describe('formatShortTime', () => {
  test('formats short time string in UTC', () => {
    expect(formatShortTime('2025-06-03T12:00:00Z', 'UTC')).toMatch(/Tue 6\/3 12:00 UTC/);
  });
  test('formats short time string in Asia/Tokyo', () => {
    expect(formatShortTime('2025-06-03T12:00:00Z', 'Asia/Tokyo')).toMatch(/Tue 6\/3 21:00 JST/);
  });
});
