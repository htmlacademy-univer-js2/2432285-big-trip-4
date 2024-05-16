import {generateRoutePoint} from '../mocks/route-point';
import {getOffersByTypes} from '../mocks/offers';
import {generateRandomDestinationList} from '../mocks/destinations';
import Observable from '../framework/observable';
import {DEFAULT_FILTER, DEFAULT_SORT, FILTER_OPTIONS} from '../const';

const ROUTE_POINTS_COUNT = Math.floor(Math.random() * 5);

export default class Model extends Observable{
  #routePoints = null;
  #offersByTypes = null;
  #destinations = null;

  #filteredRoutePoints = null;

  #currentSort = DEFAULT_SORT;
  #currentFilter = DEFAULT_FILTER;

  constructor() {
    super();
    this.#offersByTypes = getOffersByTypes();
    this.#destinations = generateRandomDestinationList();
    this.#routePoints = Array.from({length: ROUTE_POINTS_COUNT}, () => generateRoutePoint(this.#destinations));

    this.#filteredRoutePoints = this.#routePoints.filter(this.#currentFilter);
    this.#filteredRoutePoints.sort(this.#currentSort);
  }

  getFilterButtonsToDisable() {
    // сделать поле #disabledFIlterButtons, которое будет обновляться каждый раз когда обновляется поле #routePoints
    // также добавить геттер
    const buttonsToDisable = [];

    for (const [key, filter] of Object.entries(FILTER_OPTIONS)) {
      const filteredPoints = this.#routePoints.filter(filter);
      if (filteredPoints.length === 0) {
        if (DEFAULT_FILTER === FILTER_OPTIONS[key]) {
          buttonsToDisable.push(...Object.keys(FILTER_OPTIONS));
          break;
        }

        buttonsToDisable.push(key);
      }
    }

    return buttonsToDisable;
  }

  #updateItem(items, update) {
    return items.map((item) => item.id === update.id ? update : item);
  }

  get currentSort() {
    return this.#currentSort;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  set currentSort(newSort) {
    this.#currentSort = newSort;
    this.#filteredRoutePoints = this.#routePoints.sort(this.#currentSort);
  }

  set currentFilter(newFilter) {
    this.#currentFilter = newFilter;
    this.#filteredRoutePoints = this.#routePoints.filter(this.#currentFilter);
    this.#filteredRoutePoints.sort(this.#currentSort);
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByTypes() {
    return this.#offersByTypes;
  }

  get routePoints() {
    return this.#routePoints;
  }

  get filteredRoutePoints() {
    return this.#filteredRoutePoints;
  }
}
