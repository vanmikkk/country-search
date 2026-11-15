import type { Country } from './types.js';

export function renderCountryDetails(country: Country, container: HTMLElement): void {
  container.replaceChildren();

  const details = document.createElement('article');
  details.className = 'country-details';

  const flag = document.createElement('img');
  flag.className = 'country-details__flag';
  flag.src = country.flags.svg;
  flag.alt = `${country.name} flag`;

  const name = document.createElement('h2');
  name.textContent = country.name;

  const capital = document.createElement('p');
  capital.textContent = `Capital: ${country.capital ?? 'Unknown'}`;

  const region = document.createElement('p');
  region.textContent = `Region: ${country.region}`;

  const subregion = document.createElement('p');
  subregion.textContent = `Subregion: ${country.subregion ?? 'Unknown'}`;

  const population = document.createElement('p');
  population.textContent = `Population: ${country.population.toLocaleString('en-US')}`;

  const area = document.createElement('p');
  area.textContent = `Area: ${country.area.toLocaleString('en-US')} km²`;

  const borders = document.createElement('p');
  borders.textContent = `Borders: ${country.borders?.join(', ') || 'None'}`;

  const languages = document.createElement('p');
  languages.textContent = `Languages: ${country.languages.map((language) => language.name).join(', ') || 'Unknown'}`;

  const currencies = document.createElement('p');
  currencies.textContent = `Currencies: ${country.currencies?.map((currency) => `${currency.name} (${currency.symbol})`).join(', ') || 'Unknown'}`;

  details.append(
    flag,
    name,
    capital,
    region,
    subregion,
    population,
    area,
    borders,
    languages,
    currencies,
  );

  container.append(details);
}
