import AbstractView from "../framework/view/abstract-view.js"; 

function createSortTemplate(sortItems) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.map(({ type, name, isDisabled, isChecked }) => `
        <div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
          <input id="${type}" class="trip-sort__input  visually-hidden"
                 type="radio" name="trip-sort" value="${type}"
                 data-sort-type="${type}"
                 ${isDisabled ? 'disabled' : ''} ${isChecked ? 'checked' : ''}>
          <label class="trip-sort__btn" for="${type}" data-sort-type="${type}">${name}</label>
        </div>`).join('')}
    </form>`;
}

export default class TripSortView extends AbstractView {
  #sortItems = [];
  #handleSortTypeChange = null;

  constructor({sortItems, onSortTypeChange}) {
    super();
    this.#sortItems = sortItems;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT' && evt.target.tagName !== 'LABEL') {
      return;
    }

    const sortType = evt.target.dataset.sortType;
    if (sortType) {
      this.#handleSortTypeChange(sortType);
    }
  };
}
