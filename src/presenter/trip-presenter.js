import {render} from '../render.js';
import EventCreateView from '../view/event-create-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import TripSortView from '../view/trip-sort-view.js';

export default class TripPresenter {
  eventListComponent = new EventListView();

  constructor({tripContainer, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.eventsListPoints = [...this.pointsModel.getPoints()];

    render(new TripSortView(), this.tripContainer);
    render(this.eventListComponent, this.tripContainer);
    
    // Сначала рендерим форму создания
    render(new EventCreateView(), this.eventListComponent.getElement());
    
    // Затем рендерим форму редактирования
    render(new EventEditView(), this.eventListComponent.getElement());
    
    // Рендерим 3 стандартные карточки событий
    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    } 
    
    // Рендерим точки из модели данных
    for (let i = 1; i < this.eventsListPoints.length; i++) {
      const point = new EventEditView({
        point: this.eventsListPoints[i],
        offers: [...this.pointsModel.getOffersById(this.eventsListPoints[i].type, this.eventsListPoints[i].offers)],
        destination: this.pointsModel.getDestinationById(this.eventsListPoints[i].destination)
      });
      render(point, this.eventListComponent.getElement());
    }
  }
}
