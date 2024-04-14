import AbstractView from '../framework/view/abstract-view';
import {SORT_OPTIONS, DEFAULT_SORT} from '../const';


function createSortItems() {
  return Object.keys(SORT_OPTIONS).map((sortName) =>
    `<div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
        <input id="sort-${sortName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName.toLowerCase()}" ${DEFAULT_SORT === SORT_OPTIONS[sortName] ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${sortName.charAt(0).toUpperCase() + sortName.slice(1)}</label>
     </div>`).join('');
}

function createSortViewTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${createSortItems()}
     </form>`
  );
}

export default class SortView extends AbstractView {
  #currentSort = DEFAULT_SORT;
  #handleSortChange = null;

  get template() {
    return createSortViewTemplate();
  }

  get currentSort() {
    return this.#currentSort;
  }

  constructor({onSortChange}) {
    super();

    this.#handleSortChange = onSortChange;
    for (const sortName of Object.keys(SORT_OPTIONS)){
      const test = `#sort-${sortName.toLowerCase()}`;
      this.element.querySelector(test).addEventListener('change', this.#sortClickHandler);
    }
  }

  #sortClickHandler = (evt) => {
    evt.preventDefault();

    this.#currentSort = SORT_OPTIONS[evt.target.value.split('-')[1].toUpperCase()];

    this.#handleSortChange();
  };
}
