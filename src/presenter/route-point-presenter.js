import RoutePointView from '../view/route-point-view';
import EditRoutePointView from '../view/edit-form-view';
import {remove, render, replace} from '../framework/render';
import {POINT_MODE, UPDATE_TYPE, USER_ACTION} from '../const';

export default class RoutePointPresenter {
  #pointsListContainer = null;

  #routePoint = null;

  #routePointComponent = null;
  #editRoutePointComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #offersByTypes = [];
  #destinations = [];
  #mode = POINT_MODE.DEFAULT;

  constructor({offersByTypes, destinations, pointsListContainer, onDataChange, onModeChange}) {
    this.#offersByTypes = offersByTypes;
    this.#destinations = destinations;

    this.#pointsListContainer = pointsListContainer;
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
      onRollUpClick: this.#handleRollUpClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#routePointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === POINT_MODE.DEFAULT) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#mode === POINT_MODE.EDITING) {
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
    if (this.#mode !== POINT_MODE.DEFAULT) {
      this.#editRoutePointComponent.reset(this.#routePoint);

      this.#replaceEditToPointView();
    }
  }

  #replacePointToEditView() {
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = POINT_MODE.EDITING;
  }

  #replaceEditToPointView() {
    replace(this.#routePointComponent, this.#editRoutePointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = POINT_MODE.DEFAULT;
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

  #handleFormSubmit = (routePoint) => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.MINOR,
      routePoint,
    );
    this.#replaceEditToPointView();
  };

  #handleRollUpClick = () => {
    this.#editRoutePointComponent.reset(this.#routePoint);
    this.#replaceEditToPointView();
  };

  #handleDeleteClick = (task) => {
    this.#handleDataChange(
      USER_ACTION.DELETE_POINT,
      UPDATE_TYPE.MINOR,
      task,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.MINOR,
      {...this.#routePoint, isFavorite: !this.#routePoint.isFavorite},
    );
  };
}
