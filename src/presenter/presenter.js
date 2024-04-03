import SortView from '../view/sort-view';
import RoutePointView from '../view/route-point-view';
import PointsListView from '../view/route-points-list-view';
import EditFormView from '../view/edit-form-view';

import {render} from '../framework/render.js';


export default class Presenter {
  eventListComponent = new PointsListView();

  constructor({container, model}) {
    this.container = container;
    this.model = model;
  }

  init() {
    this.routePoints = [...this.model.getRoutePoints()];

    render(new SortView(), this.container);
    render(this.eventListComponent, this.container);

    render(new EditFormView({routePoint: this.routePoints[0]}), this.eventListComponent.element);

    for(let i = 1; i < this.routePoints.length; i++) {
      render(new RoutePointView({routePoint: this.routePoints[i]}), this.eventListComponent.element);
    }
  }
}
