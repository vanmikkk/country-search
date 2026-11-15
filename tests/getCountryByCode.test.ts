import { describe, expect, it, vi, afterEach } from 'vitest';

import { getCountryByCode } from '../src/getCountryByCode';

describe('getCountryByCode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch country details by alpha3 code', async () => {
    const country = {
      name: 'Spain',
      alpha3Code: 'ESP',
      population: 47351567,
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(country), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await getCountryByCode('ESP');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://countries.dev/alpha/ESP',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual(country);
  });

  it('should throw an error when the response is unsuccessful', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    await expect(getCountryByCode('ESP')).rejects.toThrow();
  });
});
