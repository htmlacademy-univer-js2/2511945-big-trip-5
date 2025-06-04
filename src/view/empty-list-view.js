import AbstractView from '../framework/view/abstract-view.js';

const NoPointTextType = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

function createEmptyListTemplate(filterType) {
  const text = NoPointTextType[filterType] || NoPointTextType.everything;
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
