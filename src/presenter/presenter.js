import SortView from '../view/sort-view';
import RoutePointView from '../view/route-point-view';
import RoutePointsListView from '../view/route-points-list-view';
import EditRoutePointView from '../view/edit-form-view';

import {render, RenderPosition, replace} from '../framework/render.js';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';
import {SITE_LIST_FILTER, TRIP_MAIN} from './constElements';
import {NO_ROUTE_POINTS_WARNING} from '../const';
import NoRoutePointsWarningView from '../view/no-points-warning-view';
import {getFilterButtonsToDisable} from '../utils';


export default class Presenter {
  #eventListComponent = new RoutePointsListView();
  #container = null;
  #routePoints = [];
  #filteredRoutePoints = [];
  #offersByTypes = [];
  #model = null;
  #warning = null;

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#routePoints = [...this.#model.routePoints];
    this.#offersByTypes = this.#model.offersByTypes;
  }

  init() {
    render(new InfoView(), TRIP_MAIN, RenderPosition.AFTERBEGIN);
    this.#renderFilter();

    const sortViewComponent = new SortView({onSortChange: () => {
      this.#filteredRoutePoints.sort(sortViewComponent.currentSort);
    }});

    this.#filteredRoutePoints.sort(sortViewComponent.currentSort);

    render(sortViewComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    if (this.#warning === null){
      this.#renderAllRoutePoints();
    }
    else {
      this.#renderNoRoutePointsWarning(this.#warning);
    }
  }

  #renderFilter() {
    let buttonsToDisable = getFilterButtonsToDisable(this.#routePoints);

    if (buttonsToDisable.includes('EVERYTHING')) {
      this.#warning = NO_ROUTE_POINTS_WARNING['EVERYTHING'];
      buttonsToDisable = buttonsToDisable.slice(1);
    }

    const filterViewComponent = new FiltersView({onFilterChange: () => {
      this.#routePoints.filter(filterViewComponent.currentFilter);
    },
    buttonsToDisable});

    this.#filteredRoutePoints = this.#routePoints.filter(filterViewComponent.currentFilter);
    render(filterViewComponent, SITE_LIST_FILTER);
  }

  #renderNoRoutePointsWarning(warning) {
    const noRoutePointsWarningComponent = new NoRoutePointsWarningView({warning});

    render(noRoutePointsWarningComponent, this.#eventListComponent.element);
  }

  #renderAllRoutePoints() {
    for(let i = 0; i < this.#filteredRoutePoints.length; i++) {
      this.#renderRoutePoint(this.#filteredRoutePoints[i]);
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
      offersByType: this.#offersByTypes,
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
