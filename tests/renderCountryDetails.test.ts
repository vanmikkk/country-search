/* @vitest-environment jsdom */

import { describe, expect, it } from 'vitest';

import { renderCountryDetails } from '../src/renderCountryDetails';
import type { Country } from '../src/types';

describe('renderCountryDetails', () => {
  it('should render detailed country information', () => {
    const country: Country = {
      name: 'Spain',
      flag: '🇪🇸',
      flags: {
        png: 'https://flagcdn.com/w320/es.png',
        svg: 'https://flagcdn.com/es.svg',
      },
      capital: 'Madrid',
      region: 'Europe',
      subregion: 'Southern Europe',
      population: 47351567,
      area: 505992,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
      languages: [
        {
          name: 'Spanish',
          iso639_1: 'es',
          iso639_2: 'spa',
          nativeName: 'Español',
        },
      ],
      alpha2Code: 'ES',
      alpha3Code: 'ESP',
      latlng: [40, -4],
    };

    const container = document.createElement('div');

    renderCountryDetails(country, container);

    const flag = container.querySelector<HTMLImageElement>('.country-details__flag');

    expect(flag).not.toBeNull();
    expect(flag?.src).toBe('https://flagcdn.com/es.svg');
    expect(flag?.alt).toBe('Spain flag');

    expect(container.textContent).toContain('Spain');
    expect(container.textContent).toContain('Madrid');
    expect(container.textContent).toContain('Europe');
    expect(container.textContent).toContain('Southern Europe');
    expect(container.textContent).toContain('47,351,567');
    expect(container.textContent).toContain('505,992');
    expect(container.textContent).toContain('AND');
    expect(container.textContent).toContain('FRA');
    expect(container.textContent).toContain('Spanish');
    expect(container.textContent).toContain('Euro');
  });

  it('should render None when country has no borders', () => {
    const country: Country = {
      name: 'Iceland',
      flag: '🇮🇸',
      flags: {
        png: 'https://flagcdn.com/w320/is.png',
        svg: 'https://flagcdn.com/is.svg',
      },
      capital: 'Reykjavik',
      region: 'Europe',
      population: 393349,
      area: 103000,
      languages: [
        {
          name: 'Icelandic',
          iso639_1: 'is',
          iso639_2: 'isl',
          nativeName: 'Íslenska',
        },
      ],
      alpha2Code: 'IS',
      alpha3Code: 'ISL',
      latlng: [65, -18],
    };

    const container = document.createElement('div');

    renderCountryDetails(country, container);

    expect(container.textContent).toContain('Borders: None');
    expect(container.textContent).toContain('Currencies: Unknown');
  });

  it('should replace previous country details when rendering a new country', () => {
    const firstCountry = {
      name: 'Spain',
      flag: '🇪🇸',
      flags: { png: '', svg: '' },
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505992,
      languages: [],
      alpha2Code: 'ES',
      alpha3Code: 'ESP',
      latlng: [40, -4],
    } satisfies Country;

    const secondCountry = {
      ...firstCountry,
      name: 'France',
      flag: '🇫🇷',
      capital: 'Paris',
    };

    const container = document.createElement('div');

    renderCountryDetails(firstCountry, container);
    renderCountryDetails(secondCountry, container);

    expect(container.textContent).toContain('France');
    expect(container.textContent).not.toContain('Spain');
    expect(container.querySelectorAll('.country-details')).toHaveLength(1);
  });
});
