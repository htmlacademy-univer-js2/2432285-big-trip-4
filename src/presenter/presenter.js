import SortView from "../view/sort-view";
import RoutePointView from "../view/route-point-view";
import PointsListView from "../view/route-points-list-view";
import EditFormView from "../view/edit-form-view";
import CreateNewFormView from "../view/create-new-form-view"
import { render } from '../render';

export default class Presenter {
  sortComponent = new SortView();
  eventListComponent = new PointsListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render(new EditFormView(), this.eventListComponent.getElement());
    render(new CreateNewFormView(), this.eventListComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.eventListComponent.getElement());
    }
  }
}
