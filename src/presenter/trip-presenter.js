import {render, remove} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import EventCreateView from '../view/event-create-view.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {generateSortItems} from '../mock/sort.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;
  #filtersModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #eventListComponent = new EventListView();
  #sortComponent = null;
  #noPointComponent = null;
  #eventCreateComponent = null;
  #newPointButton = null;
  #isCreating = false;

  constructor({container, pointsModel, filtersModel, newPointButton}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#newPointButton = newPointButton;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#newPointButton.addEventListener('click', this.#handleNewPointButtonClick);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.getPoints(this.#filterType);
    
    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
      case SortType.PRICE:
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case SortType.DAY:
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #renderTrip() {
    const points = this.points;
    const filterType = this.#filtersModel.filter;

    this.#clearTrip();

    if (points.length === 0 && !this.#pointsModel.isLoading) {
      this.#renderNoPoints(filterType);
      return;
    }

    if (this.#pointsModel.isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
    this.#renderPoints(points);
  }

  #renderLoading() {
    const loadingTemplate = '<p class="trip-events__msg">Loading...</p>';
    this.#container.innerHTML = loadingTemplate;
  }

  #renderNoPoints(filterType) {
    this.#noPointComponent = new EmptyListView({
      filterType: filterType
    });
    render(this.#noPointComponent, this.#container);
  }

  #renderSort() {
    const sortItems = generateSortItems();
    this.#sortComponent = new TripSortView({
      sortItems,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#container);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinations: this.#pointsModel.getDestinations(),
      offers: this.#pointsModel.getOffers(),
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    if (this.#eventCreateComponent) {
      this.#eventCreateComponent.element.remove();
      this.#eventCreateComponent.removeElement();
      this.#eventCreateComponent = null;
      this.#isCreating = false;
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch (err) {
      const presenter = this.#pointPresenters.get(update.id);
      if (presenter) {
        presenter.setAborting();
      }
      throw err;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #handleNewPointButtonClick = () => {
    if (this.#isCreating) {
      return;
    }

    this.#isCreating = true;
    this.#filtersModel.setFilter(FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;

    this.#eventCreateComponent = new EventCreateView({
      destinations: this.#pointsModel.getDestinations(),
      offers: this.#pointsModel.getOffers(),
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    this.#eventListComponent.element.prepend(this.#eventCreateComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#handleViewAction(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point
    );
    this.#isCreating = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCancelClick = () => {
    this.#isCreating = false;
    if (this.#eventCreateComponent) {
      this.#eventCreateComponent.element.remove();
      this.#eventCreateComponent.removeElement();
      this.#eventCreateComponent = null;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#handleCancelClick();
    }
  };
}