import {generateRoutePoint} from '../mocks/route-point';
import {getOffersByTypes} from '../mocks/offers';

const ROUTE_POINTS_COUNT = Math.floor(Math.random() * 5);

export default class Model {
  #routePoints = null;
  #offersByTypes = null;

  constructor() {
    this.#offersByTypes = getOffersByTypes();
    this.#routePoints = Array.from({length: ROUTE_POINTS_COUNT}, () => generateRoutePoint());
  }

  get offersByTypes() {
    return this.#offersByTypes;
  }

  get routePoints() {
    return this.#routePoints;
  }
}
