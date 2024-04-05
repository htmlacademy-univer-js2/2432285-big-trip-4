import AbstractView from '../framework/view/abstract-view';

function createNoRoutePointsWarningView(warning) {
  return (
    `<p class="trip-events__msg">${warning}</p>`
  );
}

export default class NoRoutePointsWarningView extends AbstractView {
  #warning = null;

  get template() {
    return createNoRoutePointsWarningView(this.#warning);
  }

  constructor({warning}) {
    super();

    this.#warning = warning;
  }
}
