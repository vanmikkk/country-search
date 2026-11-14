import { describe, expect, it } from 'vitest';

import { mapCountryResponse } from '../src/mapCountryResponse';

describe('mapCountryResponse', () => {
  it('should map raw country data to card data', () => {
    const raw = {
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: [
        {
          name: 'Spanish',
          iso639_1: 'es',
          iso639_2: 'spa',
          nativeName: 'Español',
        },
      ],
    };

    const result = mapCountryResponse(raw);

    expect(result).toEqual({
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: ['Spanish'],
    });
  });

  it('should handle missing capital and empty languages', () => {
    const raw = {
      name: 'Antarctica',
      flag: '🇦🇶',
      region: 'Polar',
      population: 1000,
      languages: [],
    };

    const result = mapCountryResponse(raw);

    expect(result).toEqual({
      name: 'Antarctica',
      flag: '🇦🇶',
      capital: null,
      region: 'Polar',
      population: 1000,
      languages: [],
    });
  });
});
