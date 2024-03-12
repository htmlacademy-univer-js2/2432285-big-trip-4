import {generateRoutePoint} from '../mocks/route-point';

const ROUTE_POINTS_COUNT = 4;

export default class Model {
  routePoints = Array.from({length: ROUTE_POINTS_COUNT}, generateRoutePoint);

  getRoutePoints() {
    return this.routePoints;
  }
}
