import type { Country } from './types';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'HttpError';
  }
}

const REQUEST_TIMEOUT = 5000;

export async function searchCountries(query: string, signal?: AbortSignal): Promise<Country[]> {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT);

  const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: 'GET',
    signal: requestSignal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(`Request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as Country[];
}
