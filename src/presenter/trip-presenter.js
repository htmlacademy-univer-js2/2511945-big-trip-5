import {render} from '../render.js';
import EventCreateView from '../view/event-create-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import TripSortView from '../view/trip-sort-view.js';

export default class TripPresenter {
  eventListComponent = new EventListView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(new TripSortView(), this.tripContainer);
    render(this.eventListComponent, this.tripContainer);
    render(new EventEditView, this.eventListComponent.getElement());
    render(new EventCreateView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }
  }
}