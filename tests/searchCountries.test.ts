import { afterEach, describe, expect, it, vi } from 'vitest';

import { searchCountries } from '../src/searchCountries';

describe('searchCountries', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch countries by name', async () => {
    const countries = [{ name: 'Spain' }];

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(countries), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await searchCountries('Spain');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://countries.dev/name/Spain',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result).toEqual(countries);
  });

  it('should encode country name in URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('[]', { status: 200 }));

    await searchCountries('South Korea');

    expect(fetch).toHaveBeenCalledWith(
      'https://countries.dev/name/South%20Korea',
      expect.any(Object),
    );
  });

  it('should return an empty array when country is not found', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));

    const result = await searchCountries('UnknownCountry');

    expect(result).toEqual([]);
  });

  it('should create an AbortSignal when none is provided', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('[]', { status: 200 }));

    await searchCountries('Spain');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('should throw HttpError for unsuccessful HTTP responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Server Error', { status: 500 }));

    await expect(searchCountries('Spain')).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });

  it('should propagate request cancellation', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new DOMException('The operation was aborted', 'AbortError'),
    );

    const controller = new AbortController();

    await expect(searchCountries('Spain', controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
  });

  it('should propagate timeout errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new DOMException('The operation timed out', 'TimeoutError'),
    );

    await expect(searchCountries('Spain')).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });

  it('should abort the request when the provided signal is aborted', async () => {
    const controller = new AbortController();

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(init.signal?.reason);
          });
        }),
    );

    const request = searchCountries('Spain', controller.signal);

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: 'AbortError',
    });

    expect(fetchMock).toHaveBeenCalled();
  });
});
