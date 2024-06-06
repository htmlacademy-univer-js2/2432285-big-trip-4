import AbstractView from '../framework/view/abstract-view';
import {SORT_OPTIONS, DEFAULT_SORT} from '../const';

function createSortItem(sortName, currentSort) {
  const sortId = `sort-${sortName.toLowerCase()}`;
  const isChecked = currentSort === SORT_OPTIONS[sortName] ? 'checked' : '';
  return `
    <div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
      <input id="${sortId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortId}" ${isChecked}>
      <label class="trip-sort__btn" for="${sortId}">${sortName.charAt(0).toUpperCase() + sortName.slice(1)}</label>
    </div>`;
}

function createSortItems(currentSort) {
  return Object.keys(SORT_OPTIONS).map((sortName) => createSortItem(sortName, currentSort)).join('');
}

function createSortViewTemplate(currentSort) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createSortItems(currentSort)}
    </form>`;
}

export default class SortView extends AbstractView {
  #currentSort = null;
  #handleSortChange = null;

  constructor({currentSort = DEFAULT_SORT, onSortChange}) {
    super();
    this.#currentSort = currentSort;
    this.#handleSortChange = onSortChange;
    this.#setSortChangeHandlers();
  }

  get template() {
    return createSortViewTemplate(this.#currentSort);
  }

  get currentSort() {
    return this.#currentSort;
  }

  #setSortChangeHandlers() {
    Object.keys(SORT_OPTIONS).forEach((sortName) => {
      const sortId = `#sort-${sortName.toLowerCase()}`;
      this.element.querySelector(sortId).addEventListener('change', this.#sortClickHandler);
    });
  }

  #sortClickHandler = (evt) => {
    evt.preventDefault();
    const sortType = evt.target.value.split('-')[1].toUpperCase();
    this.#currentSort = SORT_OPTIONS[sortType];
    this.#handleSortChange();
  };
}
