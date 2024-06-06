import Observable from '../framework/observable';
import { DEFAULT_FILTER, DEFAULT_SORT, FILTER_OPTIONS, UPDATE_TYPE } from '../const';

export default class Model extends Observable {
  #routePoints = [];
  #offersByTypes = [];
  #destinations = [];
  #filteredRoutePoints = null;
  #pointsApiService = null;
  #currentSort = DEFAULT_SORT;
  #currentFilter = DEFAULT_FILTER;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#updateFilteredRoutePoints();
  }

  async init() {
    try {
      const routePoints = await this.#pointsApiService.routePoints;
      this.#routePoints = routePoints.map(this.#adaptToClient);
      this.#updateFilteredRoutePoints();
    } catch (err) {
      this.#routePoints = null;
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offersByTypes = await this.#pointsApiService.offers;
    } catch (err) {
      this.#routePoints = null;
    }

    this._notify(UPDATE_TYPE.INIT);
  }

  getFilterButtonsToDisable() {
    const buttonsToDisable = [];

    for (const [key, filter] of Object.entries(FILTER_OPTIONS)) {
      const filteredPoints = this.routePoints ? this.#routePoints.filter(filter) : [];
      if (filteredPoints.length === 0) {
        buttonsToDisable.push(key);
      }
    }

    return buttonsToDisable;
  }

  #adaptToClient(routePoint) {
    const adaptedPoint = {
      ...routePoint,
      basePrice: routePoint['base_price'],
      dateFrom: routePoint['date_from'] !== null ? new Date(routePoint['date_from']) : routePoint['date_from'],
      dateTo: routePoint['date_to'] !== null ? new Date(routePoint['date_to']) : routePoint['date_to'],
      isFavorite: routePoint['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    return adaptedPoint;
  }

  #updateFilteredRoutePoints() {
    this.#filteredRoutePoints = this.#routePoints.filter(this.#currentFilter);
    this.#filteredRoutePoints.sort(this.#currentSort);
  }

  async updatePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting route point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        updatedPoint,
        ...this.#routePoints.slice(index + 1),
      ];

      this.#updateFilteredRoutePoints();
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#routePoints = [newPoint, ...this.#routePoints];

      this.#updateFilteredRoutePoints();
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add task');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#pointsApiService.deletePoint(update.id);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        ...this.#routePoints.slice(index + 1),
      ];

      this.#updateFilteredRoutePoints();
      this._notify(updateType, null);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
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
    this.#updateFilteredRoutePoints();
  }

  get routePoints() {
    return this.#routePoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByTypes() {
    return this.#offersByTypes;
  }

  get filteredRoutePoints() {
    return this.#routePoints === null ? null : this.#filteredRoutePoints;
  }
}
