import { debounce } from './debounce';

type SearchFunction = (query: string, signal: AbortSignal) => void;

export function createCountrySearch(search: SearchFunction, delay: number) {
  let controller: AbortController | null = null;

  const debouncedSearch = debounce((query: string) => {
    controller = new AbortController();
    search(query, controller.signal);
  }, delay);

  return (query: string): void => {
    controller?.abort();
    debouncedSearch(query);
  };
}
