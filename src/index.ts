import { createCountrySearch } from './createCountrySearch.js';
import { mapCountryResponse } from './mapCountryResponse.js';
import { renderCountryCards } from './renderCountryCards.js';
import { searchCountries } from './searchCountries.js';

const searchInput = document.querySelector<HTMLInputElement>('#country-search');
const searchStatus = document.querySelector<HTMLDivElement>('#search-status');
const countryList = document.querySelector<HTMLDivElement>('#country-list');

if (!searchInput || !searchStatus || !countryList) {
  throw new Error('Required application elements were not found.');
}

const countrySearch = createCountrySearch(
  searchCountries,
  (countries) => {
    const countryCards = countries.map(mapCountryResponse);

    renderCountryCards(countryCards, countryList);

    searchStatus.textContent =
      countries.length === 0
        ? 'No countries found.'
        : `Found ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}.`;
  },
  300,
  () => {
    searchStatus.textContent = 'Unable to load countries. Please try again.';
  },
);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  countryList.replaceChildren();

  if (!query) {
    searchStatus.textContent = '';
    countrySearch('');
    return;
  }

  searchStatus.textContent = 'Searching...';
  countrySearch(query);
});
