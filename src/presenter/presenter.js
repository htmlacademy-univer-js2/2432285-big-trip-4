import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';

import {render, RenderPosition} from '../framework/render.js';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';
import {SITE_LIST_FILTER, TRIP_MAIN} from './const-elements';
import {DEFAULT_FILTER_NAME, NO_ROUTE_POINTS_WARNING} from '../const';
import NoRoutePointsWarningView from '../view/no-points-warning-view';
import {getFilterButtonsToDisable, updateItem} from '../utils';
import RoutePointPresenter from './route-point-presenter';


export default class Presenter {
  #eventListComponent = new RoutePointsListView();
  #container = null;
  #routePoints = [];
  #filteredRoutePoints = [];
  #model = null;
  #warning = null;

  #pointPresenters = new Map();

  get routePoints() {


    return this.#model.routePoints;
  }

  get offersByTypes() {
    return this.#model.offersByTypes;
  }

  get destinations() {
    return this.#model.destinations;
  }


  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#routePoints = [...this.#model.routePoints];
  }

  init() {
    render(new InfoView(), TRIP_MAIN, RenderPosition.AFTERBEGIN);
    this.#renderSortedFilter();

    render(this.#eventListComponent, this.#container);

    if (this.#warning === null){
      this.#renderAllRoutePoints();
    }
    else {
      this.#renderNoRoutePointsWarning(this.#warning);
    }
  }

  #renderSortedFilter() {
    const buttonsToDisable = this.#modifyDisabledFilterButtons();

    const sortViewComponent = this.#createSortViewComponent();
    const filterViewComponent = new FiltersView({onFilterChange: () => {
      this.#filteredRoutePoints = this.#routePoints.filter(filterViewComponent.currentFilter);
      this.#filteredRoutePoints.sort(sortViewComponent.currentSort);
      this.#clearPointList();
      this.#renderAllRoutePoints();
    },
    buttonsToDisable});

    this.#filteredRoutePoints = this.#routePoints.filter(filterViewComponent.currentFilter);
    render(filterViewComponent, SITE_LIST_FILTER);
    this.#renderSort(sortViewComponent);
  }

  #modifyDisabledFilterButtons() {
    let buttonsToDisable = getFilterButtonsToDisable(this.#routePoints);

    if (buttonsToDisable.includes(DEFAULT_FILTER_NAME)) {
      this.#warning = NO_ROUTE_POINTS_WARNING[DEFAULT_FILTER_NAME];
      buttonsToDisable = buttonsToDisable.slice(1);
    }

    return buttonsToDisable;
  }

  #renderSort(sortViewComponent) {
    this.#filteredRoutePoints.sort(sortViewComponent.currentSort);

    render(sortViewComponent, this.#container);
  }

  #createSortViewComponent() {
    const sortViewComponent = new SortView({onSortChange: () => {
      this.#filteredRoutePoints.sort(sortViewComponent.currentSort);
      this.#clearPointList();
      this.#renderAllRoutePoints();
    }});

    return sortViewComponent;
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
    const pointPresenter = this.#pointPresenters.has(routePoint.id) ? this.#pointPresenters.get(routePoint.id) :
      new RoutePointPresenter({
        offersByTypes: this.#model.offersByTypes,
        destinations: this.#model.destinations,
        pointListContainer: this.#eventListComponent.element,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange
      });
    pointPresenter.init(routePoint);

    this.#pointPresenters.set(routePoint.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updateItem(this.#routePoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
