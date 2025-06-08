import {generateFilterItems} from '../mock/filter.js';
import TripFiltersView from '../view/trip-filters-view.js';
import {render} from '../framework/render.js';

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
    const filterItems = generateFilterItems();
    this.#filterComponent = new TripFiltersView({
      filterItems,
      currentFilter: this.#filtersModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    render(this.#filterComponent, this.#filterContainer);
  }

  #handleFilterChange = (filterType) => {
    this.#filtersModel.setFilter(filterType);
  };
}
