import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

    const search = vi.fn((_query: string, signal: AbortSignal) => {
      firstSignal = signal;
    });

    const countrySearch = createCountrySearch(search, 300);

    countrySearch('Spain');
    vi.advanceTimersByTime(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(firstSignal).toBeDefined();

    countrySearch('France');

    expect(firstSignal?.aborted).toBe(true);
  });
  it('should search only for the latest query after the debounce delay', () => {
    const search = vi.fn<(query: string, signal: AbortSignal) => void>();

    const countrySearch = createCountrySearch(search, 300);

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
    const search = vi.fn<(query: string, signal: AbortSignal) => void>();

    const countrySearch = createCountrySearch(search, 300);

    countrySearch('');

    vi.advanceTimersByTime(300);

    expect(search).not.toHaveBeenCalled();
  });
});
