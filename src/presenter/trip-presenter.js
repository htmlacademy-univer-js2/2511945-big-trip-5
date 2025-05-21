import {render} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {generateSortItems, SORT_TYPES} from '../mock/sort.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #eventListComponent = new EventListView();
  #tripContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = SORT_TYPES.DAY;
  #eventsListPoints = [];
  #sortComponent = null;

  constructor({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventsListPoints = [...this.#pointsModel.getPoints()];

    if (this.#eventsListPoints.length === 0) {
      render(new EmptyListView(), this.#tripContainer);
      return;
    }

    this.#renderSort();
    this.#renderList();
  }

  #renderSort() {
    const sortItems = generateSortItems();
    this.#sortComponent = new TripSortView({
      sortItems,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderList() {
    render(this.#eventListComponent, this.#tripContainer);
    this.#renderPoints();
  }

  #renderPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    const sortedPoints = this.#getSortedPoints();
    sortedPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      point,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    
    this.#currentSortType = sortType;
    this.#renderPoints();
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#eventsListPoints = this.#pointsModel.getPoints();
    const presenter = this.#pointPresenters.get(updatedPoint.id);
    presenter.init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #getSortedPoints() {
    const points = [...this.#eventsListPoints];

    switch (this.#currentSortType) {
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
}
