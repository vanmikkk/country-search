import { debounce } from './debounce';
import type { Country } from './types';

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
        if (currentRequestId !== requestId || currentController.signal.aborted) {
          return;
        }

        onError?.(error);
      });
  }, delay);

  return (query: string): void => {
    requestId += 1;
    controller?.abort();

    if (!query.trim()) {
      return;
    }

    debouncedSearch(query, requestId);
  };
}
