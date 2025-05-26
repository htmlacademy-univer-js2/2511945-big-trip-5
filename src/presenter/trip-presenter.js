import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateSortItems, SORT_TYPES } from '../mock/sort.js';
import PointPresenter from './point-presenter.js';
import EventCreateView from '../view/event-create-view.js';

export default class TripPresenter {
  #eventListComponent = new EventListView();
  #tripContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = SORT_TYPES.DAY;
  #sortComponent = null;
  #eventCreateComponent = null;
  #creatingPoint = null;

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    const points = this.#pointsModel.getFilteredPoints();

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderList();
  }

  #renderEmptyList() {
    render(new EmptyListView({
      filterType: this.#pointsModel.filterModel?.filter || 'everything'
    }), this.#tripContainer);
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
      onModeChange: this.#handleModeChange,
      onDeleteClick: this.#handleDeletePoint
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
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#creatingPoint) {
      this.#creatingPoint.destroy();
      this.#creatingPoint = null;
    }
  };

  #handleDeletePoint = (pointId) => {
    this.#pointsModel.deletePoint(pointId);
    this.#renderTrip();
  };

  #getSortedPoints() {
    const points = [...this.#pointsModel.getFilteredPoints()];

    switch (this.#currentSortType) {
      case SORT_TYPES.DAY:
        return points.sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
      case SORT_TYPES.TIME:
        return points.sort((a, b) => {
          const durationA = new Date(a.date_to) - new Date(a.date_from);
          const durationB = new Date(b.date_to) - new Date(b.date_from);
          return durationB - durationA;
        });
      case SORT_TYPES.PRICE:
        return points.sort((a, b) => b.base_price - a.base_price);
      default:
        return points;
    }
  }

  createPoint() {
    this.#handleModeChange();
    this.#currentSortType = SORT_TYPES.DAY;
    
    this.#creatingPoint = new PointPresenter({
      container: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      onDeleteClick: this.#handleDeletePoint
    });

    this.#creatingPoint.init();
  }
}
