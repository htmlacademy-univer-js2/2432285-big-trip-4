import AbstractView from '../framework/view/abstract-view';
import { getTripCost, getTripInfoEndDate, getTripInfoStartDate, getTripInfoTitle } from '../utils';

function createInfoViewTemplate(points, destinations, offers) {
  const totalCost = getTripCost(points, offers);

  if (totalCost === 0) {
    return '<section class="trip-main__trip-info  trip-info"> </section>';
  }

  const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cities = sortedPoints.map((point) => {
    const destination = destinations.find((dest) => dest.id === point.destination);
    return destination ? destination.name : '';
  });

  const tripInfoTitle = getTripInfoTitle(cities);
  const tripStartDate = getTripInfoStartDate(sortedPoints);
  const tripEndDate = getTripInfoEndDate(sortedPoints);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>
        <p class="trip-info__dates">${tripStartDate}&nbsp;&mdash;&nbsp;${tripEndDate}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createInfoViewTemplate(this.#points, this.#destinations, this.#offers);
  }
}
