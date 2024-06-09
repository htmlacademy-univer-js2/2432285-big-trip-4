import AbstractView from '../framework/view/abstract-view';
import { FILTER_OPTIONS, DEFAULT_FILTER} from '../const';

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

function createFiltersTemplate(disabledButtons, currentFilterName) {
  const filtersMarkup = Object.keys(FILTER_OPTIONS).map((filterName) => {
    const isChecked = currentFilterName === filterName;
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
  #currentFilterName = null;
  #handleFilterChange = null;
  #disabledButtons = [];

  constructor({ onFilterChange, buttonsToDisable, currentFilter = DEFAULT_FILTER}) {
    super();
    this.#handleFilterChange = onFilterChange;
    this.#disabledButtons = buttonsToDisable;
    this.#currentFilter = currentFilter;
    this.#currentFilterName = Object.keys(FILTER_OPTIONS).find((filterName) => (currentFilter === FILTER_OPTIONS[filterName]));
    this.#setFilterChangeHandler();
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  get currentFilterName() {
    return this.#currentFilterName;
  }

  get template() {
    return createFiltersTemplate(this.#disabledButtons, this.#currentFilterName);
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
