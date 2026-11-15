import type { CountryCard } from './types.js';

export function renderCountryCards(countries: CountryCard[], container: HTMLElement): void {
  container.replaceChildren();

  countries.forEach((country) => {
    const card = document.createElement('article');
    card.className = 'country-card';

    const flag = document.createElement('span');
    flag.className = 'country-card__flag';
    flag.textContent = country.flag;
    flag.setAttribute('aria-hidden', 'true');

    const name = document.createElement('h2');
    name.className = 'country-card__name';
    name.textContent = country.name;

    const capital = document.createElement('p');
    capital.className = 'country-card__capital';
    capital.textContent = `Capital: ${country.capital ?? 'Unknown'}`;

    const region = document.createElement('p');
    region.className = 'country-card__region';
    region.textContent = `Region: ${country.region}`;

    const population = document.createElement('p');
    population.className = 'country-card__population';
    population.textContent = `Population: ${country.population.toLocaleString('en-US')}`;

    const languages = document.createElement('p');
    languages.className = 'country-card__languages';
    languages.textContent = `Languages: ${country.languages.join(', ') || 'Unknown'}`;

    card.append(flag, name, capital, region, population, languages);
    container.append(card);
  });
}
