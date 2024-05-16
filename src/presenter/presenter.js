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
  #model = null;
  #warning = null;

  #pointPresenters = new Map();

  get routePoints() {
    return this.#model.filteredRoutePoints;
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
      this.#model.currentFilter = filterViewComponent.currentFilter;
      this.#clearPointList();
      this.#renderAllRoutePoints();
    },
    buttonsToDisable});

    this.#model.currentFilter = filterViewComponent.currentFilter;
    render(filterViewComponent, SITE_LIST_FILTER);
    render(sortViewComponent, this.#container);
  }

  #modifyDisabledFilterButtons() {
    let buttonsToDisable = this.#model.getFilterButtonsToDisable();

    if (buttonsToDisable.includes(DEFAULT_FILTER_NAME)) {
      this.#warning = NO_ROUTE_POINTS_WARNING[DEFAULT_FILTER_NAME];
      buttonsToDisable = buttonsToDisable.slice(1);
    }

    return buttonsToDisable;
  }

  #createSortViewComponent() {
    const sortViewComponent = new SortView({onSortChange: () => {
      this.#model.currentSort = sortViewComponent.currentSort;
      this.#clearPointList();
      this.#renderAllRoutePoints(this.routePoints);
    }});

    return sortViewComponent;
  }

  #renderNoRoutePointsWarning(warning) {
    const noRoutePointsWarningComponent = new NoRoutePointsWarningView({warning});

    render(noRoutePointsWarningComponent, this.#eventListComponent.element);
  }

  #renderAllRoutePoints(routePoints) {
    routePoints.forEach((point) => (this.#renderRoutePoint(point)));
  }

  #renderRoutePoint(routePoint) {
    const pointPresenter = this.#pointPresenters.has(routePoint.id) ? this.#pointPresenters.get(routePoint.id) :
      new RoutePointPresenter({
        offersByTypes: this.offersByTypes,
        destinations: this.destinations,
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
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
