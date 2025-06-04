import { fetchSun } from '../../src/custom/sun.mjs';

describe('fetchSun', () => {
  test('returns sunrise and sunset from mock fetch', async () => {
    const mockFetch = async (url) => ({
      ok: true,
      async json() {
        return {
          sys: { sunrise: 1234567890, sunset: 1234600000 }
        };
      }
    });
    const result = await fetchSun(1, 2, 'fakekey', mockFetch);
    expect(result).toEqual({ sunrise: 1234567890, sunset: 1234600000 });
  });

  test('throws on non-ok response', async () => {
    const mockFetch = async (url) => ({ ok: false, statusText: 'Bad Request', async json() { return {}; } });
    await expect(fetchSun(1, 2, 'fakekey', mockFetch)).rejects.toThrow('Failed to fetch sunrise/sunset: Bad Request');
  });

  test('throws on invalid response', async () => {
    const mockFetch = async (url) => ({
      ok: true,
      async json() { return { sys: { sunrise: 'bad', sunset: null } }; }
    });
    await expect(fetchSun(1, 2, 'fakekey', mockFetch)).rejects.toThrow('Invalid response from OpenWeatherMap');
  });
});
