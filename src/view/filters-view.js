import AbstractView from '../framework/view/abstract-view';
import { FILTER_OPTIONS, DEFAULT_FILTER, DEFAULT_FILTER_NAME } from '../const';

function createFilterButton(filterName, isChecked, isDisabled) {
  const lowerCaseFilterName = filterName.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${lowerCaseFilterName}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${lowerCaseFilterName}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${lowerCaseFilterName}">
        ${filterName}
      </label>
    </div>`;
}

function createFiltersTemplate(disabledButtons) {
  const filtersMarkup = Object.keys(FILTER_OPTIONS).map((filterName) => {
    const isChecked = DEFAULT_FILTER === FILTER_OPTIONS[filterName];
    const isDisabled = disabledButtons.includes(filterName);
    return createFilterButton(filterName, isChecked, isDisabled);
  }).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FiltersView extends AbstractView {
  #currentFilter = DEFAULT_FILTER;
  #currentFilterName = DEFAULT_FILTER_NAME;
  #handleFilterChange = null;
  #disabledButtons = [];

  constructor({ onFilterChange, buttonsToDisable }) {
    super();
    this.#handleFilterChange = onFilterChange;
    this.#disabledButtons = buttonsToDisable;
    this.#setFilterChangeHandler();
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  get currentFilterName() {
    return this.#currentFilterName;
  }

  get template() {
    return createFiltersTemplate(this.#disabledButtons);
  }

  #setFilterChangeHandler() {
    for (const filterName of Object.keys(FILTER_OPTIONS)) {
      const filterInput = this.element.querySelector(`#filter-${filterName.toLowerCase()}`);
      filterInput.addEventListener('change', this.#filterChangeHandler);
    }
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    const filterName = evt.target.value.toUpperCase();
    this.#currentFilterName = filterName;
    this.#currentFilter = FILTER_OPTIONS[filterName];
    this.#handleFilterChange();
  };
}
