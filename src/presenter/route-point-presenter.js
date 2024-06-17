import RoutePointView from '../view/route-point-view';
import EditRoutePointView from '../view/edit-route-point-view';
import { remove, render, replace } from '../framework/render';
import { POINT_MODE, UPDATE_TYPE, USER_ACTION } from '../const';

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

  constructor({ offersByTypes, destinations, pointsListContainer, onDataChange, onModeChange }) {
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
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editRoutePointComponent = new EditRoutePointView({
      routePoint: this.#routePoint,
      offersByType: this.#offersByTypes,
      destinations: this.#destinations,
      onSubmitClick: this.#handleFormSubmit,
      onRollUpClick: this.#handleRollUpClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#routePointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === POINT_MODE.DEFAULT) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#mode === POINT_MODE.EDITING) {
      replace(this.#routePointComponent, prevEditComponent);
      this.#mode = POINT_MODE.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editRoutePointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    if (this.#mode === POINT_MODE.EDITING) {
      this.#updateNetworkState({ isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === POINT_MODE.EDITING) {
      this.#updateNetworkState({ isDeleting: true });
    }
  }

  setAborting() {
    if (this.#mode === POINT_MODE.DEFAULT) {
      this.#routePointComponent.shake();
      return;
    }

    this.#editRoutePointComponent.shake(this.#resetFormState);
  }

  resetView() {
    if (this.#mode !== POINT_MODE.DEFAULT) {
      this.#editRoutePointComponent.reset(this.#routePoint);
      this.#replaceEditToPointView();
    }
  }

  #replacePointToEditView() {
    this.#handleModeChange();
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = POINT_MODE.EDITING;
  }

  #replaceEditToPointView() {
    replace(this.#routePointComponent, this.#editRoutePointComponent);
    this.#mode = POINT_MODE.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editRoutePointComponent.reset(this.#routePoint);
      this.#replaceEditToPointView();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditView();
  };

  #handleFormSubmit = (routePoint) => {
    this.#handleDataChange(USER_ACTION.UPDATE_POINT, UPDATE_TYPE.MAJOR, routePoint);
  };

  #handleRollUpClick = () => {
    this.#editRoutePointComponent.reset(this.#routePoint);
    this.#replaceEditToPointView();
  };

  #handleDeleteClick = (task) => {
    this.#handleDataChange(USER_ACTION.DELETE_POINT, UPDATE_TYPE.MAJOR, task);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.MINOR,
      { ...this.#routePoint, isFavorite: !this.#routePoint.isFavorite }
    );
  };

  #updateNetworkState({ isSaving = false, isDeleting = false } = {}) {
    this.#editRoutePointComponent.updateElement({
      networkState: {
        isDisabled: true,
        isSaving,
        isDeleting,
      },
    });
  }

  #resetFormState = () => {
    this.#editRoutePointComponent.updateElement({
      networkState: {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    });
  };
}
