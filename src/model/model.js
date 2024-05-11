import {generateRoutePoint} from '../mocks/route-point';
import {getOffersByTypes} from '../mocks/offers';
import {generateRandomDestinationList} from '../mocks/destinations';

const ROUTE_POINTS_COUNT = Math.floor(Math.random() * 5);

export default class Model {
  #routePoints = null;
  #offersByTypes = null;
  #destinations = null;

  constructor() {
    this.#offersByTypes = getOffersByTypes();
    this.#destinations = generateRandomDestinationList();
    this.#routePoints = Array.from({length: ROUTE_POINTS_COUNT}, () => generateRoutePoint(this.#destinations));
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
}
