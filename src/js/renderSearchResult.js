import * as _debounce from 'lodash.debounce';
import countries from './services/fetchCountries';
import templateItems from '../templates/countries-list.hbs';
import templateCountry from '../templates/country.hbs';
import { error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('input[name="search"]'),
  searchHintsUl: document.querySelector('.js-search-result'),
  article: document.querySelector('.js-country'),
};

const debouncedSearch = _debounce(() => {
  clearSearch();
  countries.searchedCountry = refs.input.value;
  countries.sendRequest().then(countries => {
    renderResult(countries);
  });
}, 500);

refs.input.addEventListener('input', debouncedSearch);

function clearSearch() {
  refs.article.innerHTML = '';
  refs.searchHintsUl.innerHTML = '';
}

function renderResult(countries) {
  if (countries.length > 10) {
    error({
      text: 'To many matches found. Please enter a more specific query!',
    });
    return;
  }
  if (countries.length === 1) {
    clearSearch();
    refs.article.insertAdjacentHTML('beforeend', templateCountry(countries));
    return;
  }
  clearSearch();
  refs.searchHintsUl.insertAdjacentHTML('beforeend', templateItems(countries));
}


