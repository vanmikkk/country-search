import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Country } from '../src/types';

import { createCountrySearch } from '../src/createCountrySearch';

describe('createCountrySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should abort the previous request immediately when a new query is entered', () => {
    let firstSignal: AbortSignal | undefined;

    const search = vi.fn((_query: string, signal: AbortSignal): Promise<Country[]> => {
      firstSignal = signal;
      return Promise.resolve([]);
    });

    const onResults = vi.fn();
    const countrySearch = createCountrySearch(search, onResults, 300);

    countrySearch('Spain');
    vi.advanceTimersByTime(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(firstSignal).toBeDefined();

    countrySearch('France');

    expect(firstSignal?.aborted).toBe(true);
  });

  it('should search only for the latest query after the debounce delay', () => {
    const search = vi
      .fn<(query: string, signal: AbortSignal) => Promise<Country[]>>()
      .mockResolvedValue([]);

    const onResults = vi.fn();
    const countrySearch = createCountrySearch(search, onResults, 300);

    countrySearch('Spain');
    vi.advanceTimersByTime(100);

    countrySearch('France');
    vi.advanceTimersByTime(100);

    countrySearch('Germany');

    vi.advanceTimersByTime(299);
    expect(search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('Germany', expect.any(AbortSignal));
  });

  it('should not search when the query is empty', () => {
    const search = vi
      .fn<(query: string, signal: AbortSignal) => Promise<Country[]>>()
      .mockResolvedValue([]);

    const onResults = vi.fn();
    const countrySearch = createCountrySearch(search, onResults, 300);

    countrySearch('');

    vi.advanceTimersByTime(300);

    expect(search).not.toHaveBeenCalled();
  });

  it('should ignore results from an outdated request', async () => {
    let resolveSpain!: (countries: Country[]) => void;
    let resolveFrance!: (countries: Country[]) => void;

    const search = vi
      .fn<(query: string, signal: AbortSignal) => Promise<Country[]>>()
      .mockImplementationOnce(
        () =>
          new Promise<Country[]>((resolve) => {
            resolveSpain = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<Country[]>((resolve) => {
            resolveFrance = resolve;
          }),
      );

    const onResults = vi.fn();
    const countrySearch = createCountrySearch(search, onResults, 300);

    countrySearch('Spain');
    await vi.advanceTimersByTimeAsync(300);

    countrySearch('France');
    await vi.advanceTimersByTimeAsync(300);

    const france: Country[] = [
      {
        name: 'France',
        flag: '🇫🇷',
        flags: { png: '', svg: '' },
        capital: 'Paris',
        region: 'Europe',
        population: 68000000,
        area: 0,
        languages: [],
        alpha2Code: 'FR',
        alpha3Code: 'FRA',
        latlng: [],
      },
    ];

    resolveFrance(france);
    await Promise.resolve();

    resolveSpain([]);
    await Promise.resolve();

    expect(onResults).toHaveBeenCalledTimes(1);
    expect(onResults).toHaveBeenCalledWith(france);
  });
});
