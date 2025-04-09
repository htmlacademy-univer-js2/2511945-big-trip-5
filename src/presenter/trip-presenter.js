import {render, replace} from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {generateSortItems, SORT_TYPES} from '../mock/sort.js';

export default class TripPresenter {
  eventListComponent = new EventListView();

  constructor({tripContainer, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
    this.currentSortType = SORT_TYPES.PRICE;
  }

  init() {
    this.eventsListPoints = [...this.pointsModel.getPoints()];

    if (this.eventsListPoints.length === 0) {
      render(new EmptyListView(), this.tripContainer);
      return;
    }

    this.#renderSort();
    this.#renderList();
  }

  #renderSort() {
    const sortItems = generateSortItems();
    const sortComponent = new TripSortView(sortItems);
    render(sortComponent, this.tripContainer);
  }

  #renderList() {
    render(this.eventListComponent, this.tripContainer);

    const sortedPoints = this.#getSortedPoints();

    for (const point of sortedPoints) {
      this.#renderPoint(point);
    }
  }

  #getSortedPoints() {
    const points = [...this.eventsListPoints];

    switch (this.currentSortType) {
      case SORT_TYPES.DAY:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      case SORT_TYPES.TIME:
        return points.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case SORT_TYPES.PRICE:
        return points.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return points;
    }
  }

  #renderPoints() {
    const points = this.eventsListPoints;
  
    if (points.length === 0) {
      render(new EmptyListView({filterType: this.currentFilterType}), this.tripContainer);
      return;
    }
  
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new EventView({
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EventEditView({
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onCancelClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.eventListComponent.element);
  }
}
