import AbstractView from "../framework/view/abstract-view.js"; 

function createSortTemplate(sortItems) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.map(({ type, name, isDisabled, isChecked }) => `
        <div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
          <input id="${type}" class="trip-sort__input  visually-hidden"
                 type="radio" name="trip-sort" value="${type}"
                 ${isDisabled ? 'disabled' : ''} ${isChecked ? 'checked' : ''}>
          <label class="trip-sort__btn" for="${type}">${name}</label>
        </div>`).join('')}
    </form>`;
}

export default class TripSortView extends AbstractView {
  #sortItems = [];

  constructor(sortItems) {
    super();
    this.#sortItems = sortItems;
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }
}
