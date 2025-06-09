import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filterItems, currentFilter) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems.map((filter) => `
        <div class="trip-filters__filter">
          <input 
            id="filter-${filter.type}" 
            class="trip-filters__filter-input visually-hidden" 
            type="radio" 
            name="trip-filter" 
            value="${filter.type}"
            ${filter.type === currentFilter ? 'checked' : ''}
            ${filter.isDisabled ? 'disabled' : ''}
          >
          <label 
            class="trip-filters__filter-label ${filter.isDisabled ? 'trip-filters__filter-label--disabled' : ''}" 
            for="filter-${filter.type}"
          >
            ${filter.name}
          </label>
        </div>
      `).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFiltersView extends AbstractView {
  #filterItems = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({filterItems, currentFilter, onFilterChange}) {
    super();
    this.#filterItems = filterItems;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filterItems, this.#currentFilter);
  }

  updateElement({filterItems, currentFilter}) {
    this.#filterItems = filterItems;
    this.#currentFilter = currentFilter;
    super.updateElement();
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.name === 'trip-filter' && !evt.target.disabled) {
      this.#handleFilterChange(evt.target.value);
    }
  };
}
