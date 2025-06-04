import { jest } from '@jest/globals';
import sunHandler from '../../src/commands/sun.mjs';

const mockMessage = () => {
    const obj = {
        guild: { preferredLocale: 'en-US' },
        reply: jest.fn()
    };
    return obj;
};

describe('sun command handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.TIMEZONE;
        delete process.env.LOCATION_LAT;
        delete process.env.LOCATION_LON;
    });

    test('replies with sunrise, sunset, and daylight info', async () => {
        // Use dependency injection for fetchSun
        const mockFetchSun = jest.fn().mockResolvedValue({
            sunrise: 1717401600, // 2024-06-03T04:00:00Z
            sunset: 1717452000   // 2024-06-03T18:00:00Z
        });
        process.env.TIMEZONE = 'UTC';
        process.env.LOCATION_LAT = '1';
        process.env.LOCATION_LON = '2';
        const message = mockMessage();
        await sunHandler(message, mockFetchSun); // Pass function directly
        expect(message.reply).toHaveBeenCalledWith(
            expect.stringContaining('Sunrise: 08:00') // Adjusted to match actual output
        );
        expect(message.reply).toHaveBeenCalledWith(
            expect.stringContaining('Sunset: 22:00') // Adjusted to match actual output
        );
        expect(message.reply).toHaveBeenCalledWith(
            expect.stringContaining('Daylight: 14h 0m')
        );
    });

    test('replies with error if fetchSun throws', async () => {
        const mockFetchSun = jest.fn().mockRejectedValue(new Error('fail'));
        process.env.TIMEZONE = 'UTC';
        process.env.LOCATION_LAT = '1';
        process.env.LOCATION_LON = '2';
        const message = mockMessage();
        await sunHandler(message, mockFetchSun); // Pass function directly
        expect(message.reply).toHaveBeenCalledWith(
            expect.stringContaining('Failed to fetch sunrise/sunset times')
        );
    });

    test('does nothing if location is not configured', async () => {
        const mockFetchSun = jest.fn();
        process.env.LOCATION_LAT = '';
        process.env.LOCATION_LON = '';
        const message = mockMessage();
        await sunHandler(message, mockFetchSun); // Pass function directly
        expect(message.reply).not.toHaveBeenCalled();
        expect(mockFetchSun).not.toHaveBeenCalled();
    });
});
