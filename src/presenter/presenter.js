import SortView from '../view/sort-view';
import RoutePointView from '../view/route-point-view';
import RoutePointsListView from '../view/route-points-list-view';
import EditRoutePointView from '../view/edit-form-view';

import {remove, render, replace} from '../framework/render.js';


export default class Presenter {
  #eventListComponent = new RoutePointsListView();
  #container = null;
  #routePoints = null;
  #model = null;

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#routePoints = [...this.#model.routePoints];
  }

  init() {
    const sortViewComponent = new SortView({onSortChange: () => {
      this.#routePoints.sort(sortViewComponent.currentSort);
    }});

    this.#routePoints.sort(sortViewComponent.currentSort);

    render(sortViewComponent, this.#container);
    render(this.#eventListComponent, this.#container);
    this.#renderAllRoutePoints();
  }

  #renderAllRoutePoints() {
    for(let i = 0; i < this.#routePoints.length; i++) {
      this.#renderRoutePoint(this.#routePoints[i]);
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
