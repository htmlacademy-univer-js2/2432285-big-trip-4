import AbstractView from '../framework/view/abstract-view';

function createRoutePointsListViewTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class RoutePointsListView extends AbstractView {
  get template() {
    return createRoutePointsListViewTemplate();
  }
}
