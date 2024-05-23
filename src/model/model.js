import {generateRoutePoint} from '../mocks/route-point';
import {getOffersByTypes} from '../mocks/offers';
import {generateRandomDestinationList} from '../mocks/destinations';
import Observable from '../framework/observable';
import {DEFAULT_FILTER, DEFAULT_SORT} from '../const';

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

  updatePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting route point');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      update,
      ...this.#routePoints.slice(index + 1),
    ];

    this.#filteredRoutePoints = this.#routePoints.filter(this.#currentFilter);
    this.#filteredRoutePoints.sort(this.#currentSort);

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#routePoints = [
      update,
      ...this.#routePoints,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      ...this.#routePoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  get currentSort() {
    return this.#currentSort;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  set currentSort(newSort) {
    this.#currentSort = newSort;
    this.#filteredRoutePoints.sort(this.#currentSort);
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
