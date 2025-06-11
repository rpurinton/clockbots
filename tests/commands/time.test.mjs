import { jest } from '@jest/globals';
import timeHandler from '../../src/commands/time.mjs';

describe('time command handler', () => {
  let message;
  let mockLogger;
  let mockGetClockEmoji;
  let mockFormatFullTime;
  let mockGetOffsetStr;
  let mockMoment;

  beforeEach(() => {
    message = { reply: jest.fn() };
    mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn(), debug: jest.fn() };
    mockGetClockEmoji = jest.fn().mockReturnValue(':clock10:');
    mockFormatFullTime = jest.fn().mockReturnValue('10:00 AM, June 11, 2025');
    mockGetOffsetStr = jest.fn().mockReturnValue('GMT+0');
    mockMoment = jest.fn((date) => ({
      tz: () => ({
        format: (fmt) => {
          if (fmt === 'H') return '10';
          if (fmt === 'm') return '0';
          return '';
        }
      })
    }));
  });

  test('replies with formatted time and offset', async () => {
    await timeHandler(message, {
      logger: mockLogger,
      getClockEmojiDep: mockGetClockEmoji,
      formatFullTimeDep: mockFormatFullTime,
      getOffsetStrDep: mockGetOffsetStr,
      momentDep: mockMoment
    });
    expect(mockGetClockEmoji).toHaveBeenCalledWith(10, 0);
    expect(mockFormatFullTime).toHaveBeenCalled();
    expect(mockGetOffsetStr).toHaveBeenCalled();
    expect(message.reply).toHaveBeenCalledWith(
      expect.stringContaining(':clock10: 10:00 AM, June 11, 2025 (GMT+0)')
    );
  });

  test('logs error if reply fails', async () => {
    message.reply.mockImplementation(() => { throw new Error('fail'); });
    await timeHandler(message, {
      logger: mockLogger,
      getClockEmojiDep: mockGetClockEmoji,
      formatFullTimeDep: mockFormatFullTime,
      getOffsetStrDep: mockGetOffsetStr,
      momentDep: mockMoment
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to respond to !time:', expect.any(Error)
    );
  });
});
