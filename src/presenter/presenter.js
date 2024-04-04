import SortView from '../view/sort-view';
import RoutePointView from '../view/route-point-view';
import PointsListView from '../view/route-points-list-view';
import EditRoutePointView from '../view/edit-form-view';

import {render, replace} from '../framework/render.js';


export default class Presenter {
  #eventListComponent = new PointsListView();
  #container = null;
  #model = null;

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
  }

  init() {
    const routePoints = [...this.#model.routePoints];

    render(new SortView(), this.#container);
    render(this.#eventListComponent, this.#container);


    for(let i = 0; i < routePoints.length; i++) {
      this.#renderRoutePoint(routePoints[i]);
    }
  }

  #renderRoutePoint(routePoint) {
    const escKeyHandler = (evt) => {
      if (evt.key === 'Escape') {
        replaceEditToPointView();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    const routePointComponent = new RoutePointView({routePoint: routePoint, onEditClick: () => {
      replacePointToEditView();
      document.addEventListener('keydown', escKeyHandler);
    }});

    const editRoutePointComponent = new EditRoutePointView({routePoint: routePoint,
      onSubmitClick: () => {
        replaceEditToPointView();
        document.addEventListener('keydown', escKeyHandler);
      },
      onRollUpClick: () => {
        replaceEditToPointView();
        document.addEventListener('keydown', escKeyHandler);
      }
    });

    function replacePointToEditView() {
      replace(editRoutePointComponent, routePointComponent);
    }

    function replaceEditToPointView() {
      replace(routePointComponent, editRoutePointComponent);
    }

    render(routePointComponent, this.#eventListComponent.element);
  }
}
