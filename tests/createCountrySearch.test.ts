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
});
