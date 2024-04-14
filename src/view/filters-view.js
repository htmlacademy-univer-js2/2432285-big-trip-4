import AbstractView from '../framework/view/abstract-view';
import {FILTER_OPTIONS, DEFAULT_FILTER} from '../const';

function createFiltersButtons(disabledButtons) {
  return Object.keys(FILTER_OPTIONS).map((filterName) =>
    `<div class="trip-filters__filter">
        <input id="filter-${filterName.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}" ${DEFAULT_FILTER === FILTER_OPTIONS[filterName] ? 'checked' : ''} ${disabledButtons.includes(filterName) ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
    </div>`).join('');
}

function createFiltersTemplate(disabledButtons) {
  return (
    `<form class="trip-filters" action="#" method="get">
        ${createFiltersButtons(disabledButtons)}
        <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilter = DEFAULT_FILTER;
  #handleFilterChange = null;
  #disabledButtons = [];

  get currentFilter() {
    return this.#currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#disabledButtons);
  }

  constructor({onFilterChange, buttonsToDisable}) {
    super();

    this.#disabledButtons = buttonsToDisable;

    this.#handleFilterChange = onFilterChange;
    for (const filterName of Object.keys(FILTER_OPTIONS)){
      const test = `#filter-${filterName.toLowerCase()}`;
      this.element.querySelector(test).addEventListener('change', this.#filterClickHandler);
    }
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();

    this.#currentFilter = FILTER_OPTIONS[evt.target.value.split('-')[0].toUpperCase()];

    this.#handleFilterChange();
  };
}
