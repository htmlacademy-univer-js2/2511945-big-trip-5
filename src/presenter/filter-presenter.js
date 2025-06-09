import TripFiltersView from '../view/trip-filters-view.js';
import {render} from '../framework/render.js';
import {FilterType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filtersModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    const filterItems = this.#generateFilterItems();
    this.#filterComponent = new TripFiltersView({
      filterItems,
      currentFilter: this.#filtersModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    render(this.#filterComponent, this.#filterContainer);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  #generateFilterItems() {
    const points = this.#pointsModel.points;
    const now = new Date();

    const hasFuturePoints = points.some((point) => new Date(point.dateFrom) > now);
    const hasPresentPoints = points.some((point) => 
      new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now);
    const hasPastPoints = points.some((point) => new Date(point.dateTo) < now);

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        isDisabled: points.length === 0
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isDisabled: !hasFuturePoints
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        isDisabled: !hasPresentPoints
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isDisabled: !hasPastPoints
      }
    ];
  }

  #handleModelEvent = () => {
    const filterItems = this.#generateFilterItems();
    this.#filterComponent.updateElement({
      filterItems,
      currentFilter: this.#filtersModel.filter
    });
  };

  #handleFilterChange = (filterType) => {
    if (this.#filtersModel.filter !== filterType) {
      this.#filtersModel.setFilter(filterType);
    }
  };
}
