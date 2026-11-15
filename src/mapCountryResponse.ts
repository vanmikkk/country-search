import type { Country, CountryCard } from './types.js';

type CountryResponse = Pick<Country, 'name' | 'flag' | 'region' | 'population' | 'languages'> & {
  capital?: string | null;
};

export function mapCountryResponse(country: CountryResponse): CountryCard {
  return {
    name: country.name,
    flag: country.flag,
    capital: country.capital ?? null,
    region: country.region,
    population: country.population,
    languages: country.languages.map((language) => language.name),
  };
}
