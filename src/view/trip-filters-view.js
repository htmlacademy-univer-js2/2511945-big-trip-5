import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(filters = []) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => `
        <div class="trip-filters__filter">
          <input 
            id="filter-${filter.type}" 
            class="trip-filters__filter-input visually-hidden" 
            type="radio" 
            name="trip-filter" 
            value="${filter.type}"
            ${filter.isChecked ? 'checked' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-${filter.type}">
            ${filter.name}
          </label>
        </div>
      `).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFiltersView extends AbstractView {
  #filters = [];
  #handleFilterChange = null;

  constructor({ filters, onFilterChange }) {
    super();
    this.#filters = filters || [];
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.name === 'trip-filter') {
      this.#handleFilterChange(evt.target.value);
    }
  };
}
