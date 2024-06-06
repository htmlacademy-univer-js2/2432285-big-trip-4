import {DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT} from '../const';
import { getDateDifference, getTypeOffers, humanizeDate } from '../utils';
import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';


function createOfferItem(offer) {
  return `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
}

function createRoutePointOffers(offers, offersByType) {
  const currentOffers = offersByType.filter((offer) => offers.includes(offer.id));
  return currentOffers.length > 0
    ? `<ul class="event__selected-offers">${currentOffers.map(createOfferItem).join('')}</ul>`
    : '';
}

function createRoutePointViewTemplate(routePoint, typeOffers, destinations) {
  const { basePrice, dateFrom, dateTo, isFavorite, offers, type } = routePoint;
  const currentDestination = destinations.find((destination) => destination.id === routePoint.destination);
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(dateFrom).format(DEFAULT_DATE_TIME_FORMAT)}">${humanizeDate(dateFrom, DEFAULT_DATE_FORMAT)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${currentDestination ? currentDestination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(dateFrom).format(DEFAULT_DATE_TIME_FORMAT)}">${humanizeDate(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(dateTo).format(DEFAULT_DATE_TIME_FORMAT)}">${humanizeDate(dateTo)}</time>
          </p>
          <p class="event__duration">${getDateDifference(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createRoutePointOffers(offers, typeOffers)}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class RoutePointView extends AbstractView {
  #routePoint = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;
  #destinations = null;
  #typeOffers = null;

  constructor({ routePoint, offersByType, destinations, onEditClick, onFavoriteClick }) {
    super();
    this.#routePoint = routePoint;
    this.#typeOffers = getTypeOffers(routePoint.type, offersByType);
    this.#destinations = destinations;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.#setEventListeners();
  }

  get template() {
    return createRoutePointViewTemplate(this.#routePoint, this.#typeOffers, this.#destinations);
  }

  #setEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
