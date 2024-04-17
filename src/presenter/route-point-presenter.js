import RoutePointView from '../view/route-point-view';
import EditRoutePointView from '../view/edit-form-view';
import {render, replace} from '../framework/render';


export default class RoutePointPresenter {
  #pointListContainer = null;

  #routePoint = null;

  #routePointComponent = null;
  #editRoutePointComponent = null;

  #offersByTypes = [];

  constructor({task, offersByTypes, taskListContainer}) {
    this.#routePoint = task;
    this.#offersByTypes = offersByTypes;
    this.#pointListContainer = taskListContainer;
  }

  init() {

    this.#routePointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      onEditClick: this.#handleEditClick});

    this.#editRoutePointComponent = new EditRoutePointView({
      routePoint: this.#routePoint,
      offersByType: this.#offersByTypes,
      onSubmitClick: this.#handleFormSubmit,
      onRollUpClick: this.#handleRollUpClick
    });

    render(this.#routePointComponent, this.#pointListContainer);
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
}
