import TripFiltersView from '../view/trip-filters-view.js';
import { render } from '../framework/render.js';
import { generateFilterItems } from '../mock/filter.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    const filterItems = generateFilterItems().map((item) => ({
      ...item,
      isChecked: item.type === this.#filterModel.filter
    }));

    this.#renderFilters(filterItems);
  }

  #renderFilters(filters) {
    render(
      new TripFiltersView({
        filters: Array.isArray(filters) ? filters : [],
        onFilterChange: this.#handleFilterChange
      }),
      this.#filterContainer
    );
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.filter = filterType;
    this.#pointsModel.points = this.#pointsModel.getFilteredPoints();
  };
}
