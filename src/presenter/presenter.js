import SortView from '../view/sort-view';
import RoutePointsListView from '../view/route-points-list-view';

import {remove, render, RenderPosition} from '../framework/render.js';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';
import {ADD_POINT_BUTTON, SITE_LIST_FILTER, TRIP_MAIN} from './const-elements';
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

  get offersByTypes() {
    return this.#model.offersByTypes;
  }

  get destinations() {
    return this.#model.destinations;
  }

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;

    this.#model.addObserver(this.#handleModelEvent);
    this.#addPointButton.addEventListener('click', this.#handleCreateNewPoint);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip({renderAfterHardReset = true} = {}) {
    this.#renderSortView();

    if (renderAfterHardReset) {
      render(this.#eventListComponent, this.#container);

      if (this.routePoints === null) {
        this.#renderNoRoutePointsWarning(NO_ROUTE_POINTS_WARNING.LOAD_FAIL);
        return;
      }

      this.#infoViewComponent = new InfoView(this.routePoints, this.destinations, this.offersByTypes);
      render(this.#infoViewComponent, TRIP_MAIN, RenderPosition.AFTERBEGIN);
      this.#renderFilterView();
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#warning === null && this.routePoints !== null && this.routePoints.length !== 0){
      this.#renderAllRoutePoints(this.routePoints);
    }
    else {
      this.#renderNoRoutePointsWarning(this.#warning);
      this.#warning = null;
    }
  }


  #renderFilterView() {
    const buttonsToDisable = this.#model.getFilterButtonsToDisable();

    this.#filterViewComponent = new FiltersView({onFilterChange: () => {
      this.#model.currentFilter = this.#filterViewComponent.currentFilter;

      this.#updateWarning();

      this.#model.currentSort = DEFAULT_SORT;
      this.#handleModelEvent(UPDATE_TYPE.MINOR, null);
    }, buttonsToDisable});

    this.#updateWarning();

    render(this.#filterViewComponent, SITE_LIST_FILTER);
  }

  #updateWarning() {
    if (this.routePoints !== null && this.routePoints.length === 0) {
      this.#warning = NO_ROUTE_POINTS_WARNING[this.#filterViewComponent.currentFilterName];
    }
  }

  #renderSortView() {
    this.#sortViewComponent = new SortView({
      currentSort: this.#model.currentSort,
      onSortChange: () => {
        this.#model.currentSort = this.#sortViewComponent.currentSort;
        this.#handleModelEvent(UPDATE_TYPE.MINOR, null);
      }});

    render(this.#sortViewComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderNoRoutePointsWarning(warning) {
    this.#noRoutePointsWarningComponent = new NoRoutePointsWarningView({warning});

    render(this.#noRoutePointsWarningComponent, this.#eventListComponent.element);
  }

  #renderAllRoutePoints(routePoints) {
    routePoints.forEach((point) => (this.#renderRoutePoint(point)));
  }

  #renderRoutePoint(routePoint) {
    const pointPresenter = this.#pointPresenters.has(routePoint.id) ? this.#pointPresenters.get(routePoint.id) :
      new RoutePointPresenter({
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

    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();

        try {
          await this.#model.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case USER_ACTION.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#model.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }

        break;
      case USER_ACTION.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();

        try {
          await this.#model.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearPointList();
        this.#renderTrip({renderAfterHardReset: false});
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearPointList({resetAll: true});
        this.#renderTrip();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        this.#addPointButton.disabled = false;
        this.#clearPointList({resetAll: true});
        this.#renderTrip();
        break;
    }
  };

  #clearPointList({resetAll = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#addPointButton.disabled = false;
    this.#warning = null;
    remove(this.#loadingComponent);
    remove(this.#sortViewComponent);
    this.#updateWarning();

    if (this.#noRoutePointsWarningComponent !== null) {
      remove(this.#noRoutePointsWarningComponent);
    }

    if (resetAll) {
      remove(this.#infoViewComponent);
      remove(this.#filterViewComponent);
    }
  }

  #handleModeChange = () => {
    if (this.#newPointPresenter !== null){
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
    this.#handleModelEvent(UPDATE_TYPE.MAJOR, null);
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();
    this.#handleModeChange();

    this.#resetSortAndFilter();
    if (this.routePoints.length === 0) {
      this.#clearPointList();
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
