import AbstractView from "../framework/view/abstract-view.js"; 

function createFiltersTemplate(filters) {
  return `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filters.map(({ type, name, isDisabled }, index) => `
        <div class="trip-filters__filter">
          <input id="filter-${type}" class="trip-filters__filter-input visually-hidden"
                 type="radio" name="trip-filter" value="${type}"
                 ${index === 0 ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
        </div>`).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
  <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>`;
}

export default class TripFiltersView extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
