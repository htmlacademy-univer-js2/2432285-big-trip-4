import {CITIES, POINT_TYPES} from '../const';
import {humanizeDate} from '../utils';
import AbstractView from '../framework/view/abstract-view';

function createDestinationList() {
  return (`<datalist id="destination-list-1">
                ${CITIES.map((city) => `<option value="${city}"></option>`).join('')}
            </datalist>`);
}

function createPhotosList(photos) {
  return (`        <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
                      </div>
                    </div>`);
}

function createEventTypesList(currentType) {
  return (`<div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${POINT_TYPES.map((type) =>
      `<div class="event__type-item">
                          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
                        </div>`).join('')}
                      </fieldset>
                    </div>
                  </div>`);
}

function createOffersList(offers) {
  const offersList = offers.map((offer) =>
    `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage">
                        <label class="event__offer-label" for="event-offer-luggage-1">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`).join('');

  return (`<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${offersList}
                    </div>
           </section>`);
}

function createEditRoutePointTemplate(routePoint) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = routePoint;

  return (
    `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                   ${createEventTypesList(type)}

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    ${createDestinationList()}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                    ${createOffersList(offers)}

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    ${createPhotosList(destination.pictures)}
                  </section>
                </section>
              </form>
            </li>`
  );
}

export default class EditRoutePointView extends AbstractView {
  #routePoint = null;
  #handleSubmitClick = null;
  #handleRollUpClick = null;


  get template() {
    return createEditRoutePointTemplate(this.#routePoint);
  }

  constructor({routePoint, onSubmitClick, onRollUpClick}) {
    super();
    this.#routePoint = routePoint;

    this.#handleSubmitClick = onSubmitClick;
    this.#handleRollUpClick = onRollUpClick;

    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#submitClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpClickHandler);
  }

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick();
  };

  #rollUpClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };
}
