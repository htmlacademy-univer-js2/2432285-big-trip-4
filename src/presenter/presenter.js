import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';
import { remove, render, RenderPosition } from '../framework/render.js';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';
import { ADD_POINT_BUTTON, SITE_LIST_FILTER, TRIP_MAIN } from './const-elements';
import {
  DEFAULT_FILTER, DEFAULT_SORT,
  NO_ROUTE_POINTS_WARNING,
  UPDATE_TYPE,
  USER_ACTION
} from '../const';
import NoRoutePointsWarningView from '../view/no-points-warning-view';
import RoutePointPresenter from './route-point-presenter';
import NewRoutePointPresenter from './new-route-point-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class Presenter {
  #eventListComponent = new RoutePointsListView();
  #addPointButton = ADD_POINT_BUTTON;
  #newPointPresenter = null;

  #loadingComponent = new LoadingView();
  #filterViewComponent = null;
  #sortViewComponent = null;
  #infoViewComponent = null;
  #noRoutePointsWarningComponent = null;
  #container = null;
  #model = null;

  #warning = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT
  });

  #pointPresenters = new Map();

  get routePoints() {
    return this.#model.filteredRoutePoints;
  }

  get allRoutePoints() {
    return this.#model.routePoints;
  }

  get offersByTypes() {
    return this.#model.offersByTypes;
  }

  get destinations() {
    return this.#model.destinations;
  }

  constructor({ container, model }) {
    this.#container = container;
    this.#model = model;

    this.#model.addObserver(this.#handleModelEvent);
    this.#addPointButton.addEventListener('click', this.#handleCreateNewPoint);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip({ renderAfterHardReset = true } = {}) {
    if (this.#warning === null && !this.#isLoading && this.routePoints !== null) {
      this.#renderSortView();
    }

    if (renderAfterHardReset) {
      render(this.#eventListComponent, this.#container);

      if (this.routePoints === null) {
        this.#addPointButton.disabled = true;
        this.#renderNoRoutePointsWarning(NO_ROUTE_POINTS_WARNING.LOAD_FAIL);
        return;
      }

      this.#renderFilterView();

      this.#infoViewComponent = new InfoView(this.allRoutePoints, this.destinations, this.offersByTypes);
      render(this.#infoViewComponent, TRIP_MAIN, RenderPosition.AFTERBEGIN);
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#warning === null && this.routePoints !== null && this.routePoints.length !== 0) {
      this.#renderAllRoutePoints(this.routePoints);
    } else {
      this.#renderNoRoutePointsWarning(this.#warning);
      this.#warning = null;
    }
  }

  #renderFilterView() {
    const buttonsToDisable = this.#model.getFilterButtonsToDisable();

    this.#filterViewComponent = new FiltersView({
      onFilterChange: () => {
        this.#model.currentFilter = this.#filterViewComponent.currentFilter;
        this.#updateWarning();
        this.#model.currentSort = DEFAULT_SORT;
        this.#handleModelEvent(UPDATE_TYPE.MINOR);
      },
      buttonsToDisable,
      currentFilter: this.#model.currentFilter
    });

    if (this.routePoints.length === 0) {
      this.#model.currentFilter = this.#filterViewComponent.currentFilter;
    }

    render(this.#filterViewComponent, SITE_LIST_FILTER);
  }

  #updateWarning() {
    if (this.routePoints !== null && this.routePoints.length === 0) {
      this.#warning = NO_ROUTE_POINTS_WARNING[this.#filterViewComponent.currentFilterName];
    }
    else {
      this.#warning = null;
    }
  }

  #renderSortView() {
    this.#sortViewComponent = new SortView({
      currentSort: this.#model.currentSort,
      onSortChange: () => {
        this.#model.currentSort = this.#sortViewComponent.currentSort;
        this.#handleModelEvent(UPDATE_TYPE.MINOR);
      }
    });

    render(this.#sortViewComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderNoRoutePointsWarning(warning) {
    this.#noRoutePointsWarningComponent = new NoRoutePointsWarningView({ warning });
    render(this.#noRoutePointsWarningComponent, this.#eventListComponent.element);
  }

  #renderAllRoutePoints(routePoints) {
    routePoints.forEach((point) => this.#renderRoutePoint(point));
  }

  #renderRoutePoint(routePoint) {
    const pointPresenter = this.#pointPresenters.get(routePoint.id) || new RoutePointPresenter({
      offersByTypes: this.offersByTypes,
      destinations: this.destinations,
      pointsListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(routePoint);
    this.#pointPresenters.set(routePoint.id, pointPresenter);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case USER_ACTION.UPDATE_POINT:
          this.#pointPresenters.get(update.id).setSaving();
          await this.#model.updatePoint(updateType, update);
          break;
        case USER_ACTION.ADD_POINT:
          this.#newPointPresenter.setSaving();
          await this.#model.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
          break;
        case USER_ACTION.DELETE_POINT:
          this.#pointPresenters.get(update.id).setDeleting();
          await this.#model.deletePoint(updateType, update);
          break;
      }
    } catch (err) {
      if (actionType === USER_ACTION.UPDATE_POINT || actionType === USER_ACTION.DELETE_POINT) {
        this.#pointPresenters.get(update.id).setAborting();
      } else if (actionType === USER_ACTION.ADD_POINT) {
        this.#newPointPresenter.setAborting();
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UPDATE_TYPE.MINOR:
        this.#clearTrip();
        this.#renderTrip({ renderAfterHardReset: false });
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearTrip({ resetAll: true });
        this.#renderTrip();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        this.#addPointButton.disabled = false;
        this.#clearTrip({ resetAll: true });
        this.#renderTrip();
        break;
    }
  };

  #clearTrip({ resetAll = false } = {}) {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.destroy());

    this.#pointPresenters.clear();
    this.#addPointButton.disabled = false;
    this.#warning = null;
    remove(this.#loadingComponent);
    remove(this.#sortViewComponent);
    this.#updateWarning();

    if (this.#noRoutePointsWarningComponent) {
      remove(this.#noRoutePointsWarningComponent);
    }

    if (resetAll) {
      remove(this.#infoViewComponent);
      remove(this.#filterViewComponent);
    }
  }

  #handleModeChange = () => {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }

    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderLoading() {
    this.#addPointButton.disabled = true;
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #resetSortAndFilter = () => {
    this.#model.currentFilter = DEFAULT_FILTER;
    this.#model.currentSort = DEFAULT_SORT;
    this.#handleModelEvent(UPDATE_TYPE.MAJOR);
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();
    this.#handleModeChange();

    this.#resetSortAndFilter();
    if (this.routePoints.length === 0) {
      this.#clearTrip();
    }

    this.#renderNewPoint();
    this.#addPointButton.disabled = true;
  };

  #renderNewPoint() {
    this.#newPointPresenter = new NewRoutePointPresenter({
      offersByTypes: this.offersByTypes,
      destinations: this.destinations,
      addPointButton: this.#addPointButton,
      pointsListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onCancel: this.#handleModelEvent,
      hasAtLeastOnePoint: this.routePoints.length > 0
    });

    this.#newPointPresenter.init();
  }
}
