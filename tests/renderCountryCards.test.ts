/* @vitest-environment jsdom */

import { describe, expect, it, vi } from 'vitest';

import { renderCountryCards } from '../src/renderCountryCards';
import type { CountryCard } from '../src/types';

describe('renderCountryCards', () => {
  it('should render country information', () => {
    const countries: CountryCard[] = [
      {
        name: 'Spain',
        flag: '🇪🇸',
        capital: 'Madrid',
        region: 'Europe',
        population: 47351567,
        languages: ['Spanish'],
        alpha3Code: 'ESP',
      },
    ];

    const container = document.createElement('div');

    renderCountryCards(countries, container, () => {});

    expect(container.textContent).toContain('Spain');
    expect(container.textContent).toContain('🇪🇸');
    expect(container.textContent).toContain('Madrid');
    expect(container.textContent).toContain('Europe');
    expect(container.textContent).toContain('Spanish');
    expect(container.textContent).toContain('47,351,567');
  });

  it('should render multiple countries', () => {
    const countries: CountryCard[] = [
      {
        name: 'Spain',
        flag: '🇪🇸',
        capital: 'Madrid',
        region: 'Europe',
        population: 47351567,
        languages: ['Spanish'],
        alpha3Code: 'ESP',
      },
      {
        name: 'France',
        flag: '🇫🇷',
        capital: 'Paris',
        region: 'Europe',
        population: 68000000,
        languages: ['French'],
        alpha3Code: 'FRA',
      },
    ];

    const container = document.createElement('div');

    renderCountryCards(countries, container, () => {});

    expect(container.querySelectorAll('.country-card')).toHaveLength(2);
  });

  it('should call onSelect when a country card is clicked', () => {
    const countries: CountryCard[] = [
      {
        name: 'Spain',
        flag: '🇪🇸',
        capital: 'Madrid',
        region: 'Europe',
        population: 47351567,
        languages: ['Spanish'],
        alpha3Code: 'ESP',
      },
    ];

    const container = document.createElement('div');
    const onSelect = vi.fn();

    renderCountryCards(countries, container, onSelect);

    const card = container.querySelector<HTMLButtonElement>('.country-card');

    card?.click();

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(countries[0]);
  });
});
