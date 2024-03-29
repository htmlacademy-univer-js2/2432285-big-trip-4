import {generateRoutePoint} from '../mocks/route-point';
import {POINT_TYPES, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomNumber} from '../utils';
import {generateRandomOffer} from '../mocks/offers';

const ROUTE_POINTS_COUNT = 4;

const LIMIT = 5;

export default class Model {
  routePoints = Array.from({length: ROUTE_POINTS_COUNT}, () => generateRoutePoint(this.generateOffersByType()));

  getRoutePoints() {
    return this.routePoints;
  }

  generateOffersByType() {
    const offersCount = Math.floor(Math.random() * LIMIT + 1);
    const offersByTypes = POINT_TYPES.map((type) => ({type,
      offers: Array.from({length: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, offersCount)}, () => (generateRandomOffer()))}));

    return offersByTypes;
  }
}
