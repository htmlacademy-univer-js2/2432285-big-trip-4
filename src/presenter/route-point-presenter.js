import RoutePointView from '../view/route-point-view';
import EditRoutePointView from '../view/edit-form-view';
import {remove, render, replace} from '../framework/render';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class RoutePointPresenter {
  #pointListContainer = null;

  #routePoint = null;

  #routePointComponent = null;
  #editRoutePointComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #offersByTypes = [];
  #destinations = [];
  #mode = MODE.DEFAULT;

  constructor({offersByTypes, destinations, pointListContainer: pointsListContainer, onDataChange, onModeChange}) {
    this.#offersByTypes = offersByTypes;
    this.#destinations = destinations;
    this.#pointListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(routePoint) {
    this.#routePoint = routePoint;

    const prevPointComponent = this.#routePointComponent;
    const prevEditComponent = this.#editRoutePointComponent;

    this.#routePointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      offersByType: this.#offersByTypes,
      destinations: this.#destinations,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editRoutePointComponent = new EditRoutePointView({
      routePoint: this.#routePoint,
      offersByType: this.#offersByTypes,
      destinations: this.#destinations,
      onSubmitClick: this.#handleFormSubmit,
      onRollUpClick: this.#handleRollUpClick
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#routePointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#editRoutePointComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editRoutePointComponent);
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPointView();
    }
  }

  #replacePointToEditView() {
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceEditToPointView() {
    replace(this.#routePointComponent, this.#editRoutePointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#replaceEditToPointView();
      this.#editRoutePointComponent.reset(this.#routePoint);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditView();
  };

  #handleFormSubmit = () => {
    this.#replaceEditToPointView();
  };

  #handleRollUpClick = () => {
    this.#editRoutePointComponent.reset(this.#routePoint);
    this.#replaceEditToPointView();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#routePoint, isFavorite: !this.#routePoint.isFavorite});
  };
}
