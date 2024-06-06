import EditRoutePointView from '../view/edit-form-view';
import { POINT_MODE, UPDATE_TYPE, USER_ACTION } from '../const';
import { remove, render, RenderPosition } from '../framework/render';

export default class NewRoutePointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleModelUpdateOnCancel = null;
  #hasAtLeastOnePoint = null;
  #newPointComponent = null;
  #addPointButton = null;
  #offersByTypes = [];
  #destinations = [];

  constructor({
    offersByTypes,
    destinations,
    addPointButton,
    pointsListContainer,
    onDataChange,
    onCancel,
    hasAtLeastOnePoint
  }) {
    this.#offersByTypes = offersByTypes;
    this.#destinations = destinations;
    this.#addPointButton = addPointButton;
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModelUpdateOnCancel = onCancel;
    this.#hasAtLeastOnePoint = hasAtLeastOnePoint;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#newPointComponent = new EditRoutePointView({
      offersByType: this.#offersByTypes,
      destinations: this.#destinations,
      onSubmitClick: this.#handleFormSubmit,
      onRollUpClick: null,
      onDeleteClick: this.#handleCancelNewPoint,
      mode: POINT_MODE.CREATING
    });

    render(this.#newPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#addPointButton.disabled = false;

    if (!this.#hasAtLeastOnePoint) {
      this.#handleModelUpdateOnCancel(UPDATE_TYPE.MINOR);
    }
  }

  setSaving() {
    this.#newPointComponent.updateElement({
      networkState: {
        isDisabled: true,
        isSaving: true,
        isDeleting: false
      }
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        networkState: {
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (routePoint) => {
    if (routePoint.destination !== null) {
      this.#addPointButton.disabled = false;

      this.#handleDataChange(
        USER_ACTION.ADD_POINT,
        UPDATE_TYPE.MAJOR,
        routePoint,
      );
    }
  };

  #handleCancelNewPoint = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
