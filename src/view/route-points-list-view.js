import { createElement } from '../render';

function createRoutePointsListViewTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class RoutePointsListView {
  getTemplate() {
    return createRoutePointsListViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
