import { createCountrySearch } from './createCountrySearch.js';
import { mapCountryResponse } from './mapCountryResponse.js';
import { renderCountryCards } from './renderCountryCards.js';
import { searchCountries } from './searchCountries.js';
import { getCountryByCode } from './getCountryByCode.js';
import { renderCountryDetails } from './renderCountryDetails.js';

const app = document.createElement('main');
app.className = 'app';

const header = document.createElement('header');
header.className = 'app__header';

const title = document.createElement('h1');
title.textContent = 'Country Search';

const description = document.createElement('p');
description.textContent = 'Find a country and explore its information.';

header.append(title, description);

const searchSection = document.createElement('section');
searchSection.className = 'search';
searchSection.setAttribute('aria-label', 'Country search');

const searchLabel = document.createElement('label');
searchLabel.htmlFor = 'country-search';
searchLabel.textContent = 'Country name';

const searchInput = document.createElement('input');
searchInput.id = 'country-search';
searchInput.name = 'country';
searchInput.type = 'search';
searchInput.placeholder = 'Start typing a country name...';
searchInput.autocomplete = 'off';

searchSection.append(searchLabel, searchInput);

const results = document.createElement('section');
results.className = 'results';
results.setAttribute('aria-live', 'polite');
results.setAttribute('aria-label', 'Search results');

const searchStatus = document.createElement('div');
searchStatus.id = 'search-status';

const retryButton = document.createElement('button');
retryButton.id = 'retry-search';
retryButton.className = 'retry-button';
retryButton.type = 'button';
retryButton.textContent = 'Retry';
retryButton.hidden = true;

const countryList = document.createElement('div');
countryList.id = 'country-list';

const countryDialog = document.createElement('dialog');
countryDialog.id = 'country-details';
countryDialog.className = 'country-dialog';
countryDialog.setAttribute('aria-label', 'Country details');

const closeButton = document.createElement('button');
closeButton.id = 'close-country-details';
closeButton.className = 'country-dialog__close';
closeButton.type = 'button';
closeButton.textContent = '×';
closeButton.setAttribute('aria-label', 'Close country details');

const countryDetails = document.createElement('div');
countryDetails.id = 'country-details-content';

countryDialog.append(closeButton, countryDetails);
results.append(searchStatus, retryButton, countryList, countryDialog);
app.append(header, searchSection, results);

document.body.append(app);

let lastQuery = '';

closeButton.addEventListener('click', () => {
  countryDialog.close();
});

countryDialog.addEventListener('click', (event: MouseEvent) => {
  if (event.target === countryDialog) {
    countryDialog.close();
  }
});

const countrySearch = createCountrySearch(
  searchCountries,
  (countries) => {
    retryButton.hidden = true;

    const countryCards = countries.map(mapCountryResponse);

    renderCountryCards(countryCards, countryList, async (country) => {
      searchStatus.textContent = `Loading ${country.name}...`;

      countryDialog.showModal();
      countryDetails.textContent = 'Loading country details...';

      try {
        const fullCountry = await getCountryByCode(country.alpha3Code);

        renderCountryDetails(fullCountry, countryDetails);
        searchStatus.textContent = '';
      } catch {
        countryDetails.textContent = 'Unable to load country details. Please try again.';
        searchStatus.textContent = '';
      }
    });

    searchStatus.textContent =
      countries.length === 0
        ? 'No countries found.'
        : `Found ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}.`;
  },
  300,
  () => {
    searchStatus.textContent = 'Unable to load countries. Please try again.';
    retryButton.hidden = false;
  },
);

retryButton.addEventListener('click', () => {
  if (!lastQuery) {
    return;
  }

  retryButton.hidden = true;
  searchStatus.textContent = 'Searching...';
  countrySearch(lastQuery);
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  lastQuery = query;

  countryList.replaceChildren();
  retryButton.hidden = true;

  if (countryDialog.open) {
    countryDialog.close();
  }

  countryDetails.replaceChildren();

  if (!query) {
    searchStatus.textContent = '';
    countrySearch('');
    return;
  }

  searchStatus.textContent = 'Searching...';
  countrySearch(query);
});
