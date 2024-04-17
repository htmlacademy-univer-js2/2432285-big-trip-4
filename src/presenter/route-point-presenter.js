import RoutePointView from '../view/route-point-view';
import EditRoutePointView from '../view/edit-form-view';
import {remove, render, replace} from '../framework/render';


export default class RoutePointPresenter {
  #pointListContainer = null;

  #routePoint = null;

  #routePointComponent = null;
  #editRoutePointComponent = null;

  #handleDataChange = null;

  #offersByTypes = [];

  constructor({offersByTypes, taskListContainer, onDataChange}) {
    this.#offersByTypes = offersByTypes;
    this.#pointListContainer = taskListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(routePoint) {
    this.#routePoint = routePoint;

    const prevPointComponent = this.#routePointComponent;
    const prevEditComponent = this.#editRoutePointComponent;

    this.#routePointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editRoutePointComponent = new EditRoutePointView({
      routePoint: this.#routePoint,
      offersByType: this.#offersByTypes,
      onSubmitClick: this.#handleFormSubmit,
      onRollUpClick: this.#handleRollUpClick
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#routePointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#routePointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevEditComponent.element)) {
      replace(this.#editRoutePointComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editRoutePointComponent);
  }

  #replacePointToEditView() {
    replace(this.#editRoutePointComponent, this.#routePointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditToPointView() {
    replace(this.#routePointComponent, this.#editRoutePointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#replaceEditToPointView();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditView();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceEditToPointView();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleRollUpClick = () => {
    this.#replaceEditToPointView();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#routePoint, isFavorite: !this.#routePoint.isFavorite});
  };
}
