import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(destinations, dates, cost) {
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #dates = null;
  #cost = null;

  constructor({destinations, dates, cost}) {
    super();
    this.#destinations = destinations;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate(this.#destinations, this.#dates, this.#cost);
  }
}
