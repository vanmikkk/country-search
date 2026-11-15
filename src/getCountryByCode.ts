import type { Country } from './types.js';

export async function getCountryByCode(code: string): Promise<Country> {
  const url = `https://countries.dev/alpha/${encodeURIComponent(code)}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as Country;
}
