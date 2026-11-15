import { debounce } from './debounce.js';
import type { Country } from './types.js';

type SearchFunction = (query: string, signal: AbortSignal) => Promise<Country[]>;
type ResultsCallback = (countries: Country[]) => void;
type ErrorCallback = (error: unknown) => void;

export function createCountrySearch(
  search: SearchFunction,
  onResults: ResultsCallback,
  delay: number,
  onError?: ErrorCallback,
) {
  let controller: AbortController | null = null;
  let requestId = 0;

  const debouncedSearch = debounce((query: string, currentRequestId: number) => {
    const currentController = new AbortController();
    controller = currentController;

    void search(query, currentController.signal)
      .then((countries) => {
        if (currentRequestId !== requestId || currentController.signal.aborted) {
          return;
        }

        onResults(countries);
      })
      .catch((error: unknown) => {
        if (
          currentRequestId !== requestId ||
          currentController.signal.aborted ||
          (error instanceof Error && error.name === 'AbortError')
        ) {
          return;
        }

        onError?.(error);
      });
  }, delay);

  return (query: string): void => {
    requestId += 1;
    controller?.abort();

    if (!query.trim()) {
      debouncedSearch.cancel();
      return;
    }

    debouncedSearch(query, requestId);
  };
}
