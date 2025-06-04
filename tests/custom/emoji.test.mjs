import { getClockEmoji } from '../../src/custom/emoji.mjs';

describe('getClockEmoji', () => {
  test('returns full hour emoji for 00:00', () => {
    expect(getClockEmoji(0, 0)).toBe('🕛');
  });
  test('returns half hour emoji for 01:30', () => {
    expect(getClockEmoji(1, 30)).toBe('🕜');
  });
  test('returns next hour emoji for 02:50', () => {
    expect(getClockEmoji(2, 50)).toBe('🕒');
  });
  test('returns full hour emoji for 13:00', () => {
    expect(getClockEmoji(13, 0)).toBe('🕐');
  });
  test('returns half hour emoji for 23:30', () => {
    expect(getClockEmoji(23, 30)).toBe('🕦');
  });
  test('returns next hour emoji for 23:59', () => {
    expect(getClockEmoji(23, 59)).toBe('🕛');
  });
});
