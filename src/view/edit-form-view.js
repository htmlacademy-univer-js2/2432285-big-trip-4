import { DEFAULT_DESTINATION, DEFAULT_ROUTE_POINT, EDIT_POINT_VIEW_BUTTON_TEXT, POINT_MODE, POINT_TYPES } from '../const';
import { getTypeOffers, humanizeDate } from '../utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createDestinationList(destinations) {
  return `<datalist id="destination-list-1">
            ${destinations.map(({ name }) => `<option value="${name}"></option>`).join('')}
          </datalist>`;
}

function createPhotosList(photos) {
  return photos.length === 0
    ? ''
    : `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${photos.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
         </div>
       </div>`;
}

function createEventTypesList(currentType, isDisabled) {
  return `<div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${POINT_TYPES.map((type) => `
                  <div class="event__type-item">
                    <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  </div>`).join('')}
              </fieldset>
            </div>
          </div>`;
}

function createOffersList(offers, typeOffers, isDisabled) {
  return typeOffers.map(({ id, title, price }) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="${id}" type="checkbox" name="${id}" ${offers.includes(id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${title}</span> &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');
}

function createButtonTemplate(mode, isDisabled, isDeleting) {
  let text;
  if (mode === POINT_MODE.CREATING) {
    text = EDIT_POINT_VIEW_BUTTON_TEXT.CANCEL;
  }
  else {
    text = isDeleting ? EDIT_POINT_VIEW_BUTTON_TEXT.LOAD_DELETE : EDIT_POINT_VIEW_BUTTON_TEXT.DELETE;
  }

  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${text}</button>`;
}

function createEditRoutePointTemplate(state, offersByType, destinations, mode) {
  const { routePoint, networkState } = state;
  const { isDisabled, isSaving, isDeleting } = networkState;
  const { basePrice, dateFrom, dateTo, offers, type, destination } = routePoint;
  const currentDestination = destination !== null ? destinations.find((dest) => dest.id === destination) : DEFAULT_DESTINATION;
  const typeOffers = getTypeOffers(type, offersByType);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createEventTypesList(type, isDisabled)}
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${createDestinationList(destinations)}
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1"><span class="visually-hidden">Price</span>&euro;</label>
            <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" min="0" max="100000" ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? EDIT_POINT_VIEW_BUTTON_TEXT.LOAD_SAVE : EDIT_POINT_VIEW_BUTTON_TEXT.SAVE}
          </button>
          ${createButtonTemplate(mode, isDisabled, isDeleting)}
          ${mode === POINT_MODE.EDITING ? `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>` : ''}
        </header>
        ${typeOffers.length === 0 ? '' : `
        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${createOffersList(offers, typeOffers, isDisabled)}</div>
          </section>
        </section>`}
        ${currentDestination === DEFAULT_DESTINATION || (currentDestination.description.length === 0 && currentDestination.pictures.length === 0) ? '' : `
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${currentDestination.description}</p>
          ${createPhotosList(currentDestination.pictures)}
        </section>`}
      </form>
    </li>`;
}

export default class EditRoutePointView extends AbstractStatefulView {
  #routePoint = null;
  #offersByType = null;
  #destinations = null;
  #handleSubmitClick = null;
  #handleRollUpClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #mode = null;

  constructor({ routePoint = DEFAULT_ROUTE_POINT(), offersByType, destinations, onSubmitClick, onRollUpClick, onDeleteClick, mode = POINT_MODE.EDITING }) {
    super();
    this.#routePoint = routePoint;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#handleSubmitClick = onSubmitClick;
    this.#handleRollUpClick = onRollUpClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#mode = mode;

    const networkState = {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };

    this._setState({ routePoint, networkState });
    this._restoreHandlers();
  }

  get template() {
    return createEditRoutePointTemplate(this._state, this.#offersByType, this.#destinations, this.#mode);
  }

  _restoreHandlers() {
    if (this.#mode === POINT_MODE.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpClickHandler);
    }

    this.element.querySelector('form').addEventListener('submit', this.#submitClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#initDatepickers();
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state.routePoint);
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(this._state.routePoint);
  };

  #rollUpClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  #priceChangeHandler = (evt) => {
    this._setState({ routePoint: { ...this._state.routePoint, basePrice: evt.target.valueAsNumber } });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({ routePoint: { ...this._state.routePoint, type: evt.target.value, offers: [] } });
  };

  #destinationChangeHandler = (evt) => {
    const destination = this.#destinations.find((dest) => dest.name === evt.target.value)?.id ?? undefined;
    this.updateElement({ routePoint: { ...this._state.routePoint, destination } });
  };

  #offerChangeHandler = (evt) => {
    const { id } = evt.target;
    const { offers } = this._state.routePoint;
    const offerIndex = offers.indexOf(id);

    if (offerIndex !== -1) {
      offers.splice(offerIndex, 1);
    } else {
      offers.push(id);
    }

    this._setState({ routePoint: { ...this._state.routePoint, offers } });
  };

  reset(routePoint) {
    this.updateElement({ routePoint });
  }

  #initDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const config = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: { firstDayOfWeek: 1 },
      'time_24hr': true,
    };

    this.#createDatepicker(dateFromElement, dateToElement, config);
  };

  #createDatepicker = (dateFromElement, dateToElement, config) => {
    this.#datepickerFrom = flatpickr(dateFromElement, {
      ...config,
      defaultDate: this._state.routePoint.dateFrom,
      maxDate: this._state.routePoint.dateTo,
      onClose: this.#handleDateFromClose,
    });

    this.#datepickerTo = flatpickr(dateToElement, {
      ...config,
      defaultDate: this._state.routePoint.dateTo,
      minDate: this._state.routePoint.dateFrom,
      onClose: this.#handleDateToClose,
    });
  };

  #handleDateFromClose = ([userDate]) => {
    this._setState({ routePoint: { ...this._state.routePoint, dateFrom: userDate } });
    this.#datepickerTo.set('minDate', userDate);
  };

  #handleDateToClose = ([userDate]) => {
    this._setState({ routePoint: { ...this._state.routePoint, dateTo: userDate } });
    this.#datepickerFrom.set('maxDate', userDate);
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }
}
