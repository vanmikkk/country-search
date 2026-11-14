import { afterEach, describe, expect, it, vi } from 'vitest';

import { debounce } from '../src/debounce';

describe('debounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer when called again before delay expires', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback();

    vi.advanceTimersByTime(200);
    debouncedCallback();

    vi.advanceTimersByTime(200);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the original function', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('Spain');

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledWith('Spain');
  });
});
