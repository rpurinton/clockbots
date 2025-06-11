import { jest } from '@jest/globals';
import helpHandler from '../../src/commands/help.mjs';

describe('help command handler', () => {
  let interaction;
  let mockLogger;
  let mockGetMsg;

  beforeEach(() => {
    interaction = {
      locale: 'en-US',
      reply: jest.fn()
    };
    mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn(), debug: jest.fn() };
    mockGetMsg = jest.fn().mockReturnValue('Help text!');
  });

  test('replies with help content', async () => {
    await helpHandler(interaction, { logger: mockLogger, getMsgDep: mockGetMsg });
    expect(mockGetMsg).toHaveBeenCalledWith('en-US', 'help', 'No help available for this command.', mockLogger);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Help text!',
      flags: 1 << 6
    });
  });

  test('logs error and replies with fallback if reply fails', async () => {
    mockGetMsg.mockReturnValue('Help text!');
    interaction.reply.mockImplementationOnce(() => { throw new Error('fail'); });
    await helpHandler(interaction, { logger: mockLogger, getMsgDep: mockGetMsg });
    expect(mockLogger.error).toHaveBeenCalledWith('Error in /help handler', expect.any(Error));
    // Should attempt to reply with fallback error message
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'An error occurred while processing your request.',
      flags: 1 << 6
    });
  });

  test('logs error if fallback reply also fails', async () => {
    mockGetMsg.mockReturnValue('Help text!');
    interaction.reply.mockImplementation(() => { throw new Error('fail'); });
    await helpHandler(interaction, { logger: mockLogger, getMsgDep: mockGetMsg });
    expect(mockLogger.error).toHaveBeenCalledWith('Failed to reply with error message', expect.any(Error));
  });
});
