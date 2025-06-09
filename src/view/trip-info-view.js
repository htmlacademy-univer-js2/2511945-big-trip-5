import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function formatDates(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const startMonth = dayjs(dateFrom).format('MMM');
  const startDay = dayjs(dateFrom).format('DD');
  const endMonth = dayjs(dateTo).format('MMM');
  const endDay = dayjs(dateTo).format('DD');
  
  if (startMonth === endMonth && startDay === endDay) {
    return `${startMonth} ${startDay}`;
  }
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} — ${endDay}`;
  }
  return `${startMonth} ${startDay} — ${endMonth} ${endDay}`;
}

function createTripInfoTemplate({destinations, dateFrom, dateTo, cost}) {
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations || ''}</h1>
        <p class="trip-info__dates">${formatDates(dateFrom, dateTo)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost || 0}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #dateFrom = null;
  #dateTo = null;
  #cost = null;

  constructor({destinations, dateFrom, dateTo, cost}) {
    super();
    this.#destinations = destinations;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate({
      destinations: this.#destinations,
      dateFrom: this.#dateFrom,
      dateTo: this.#dateTo,
      cost: this.#cost
    });
  }

  updateElement({destinations, dateFrom, dateTo, cost}) {
    this.#destinations = destinations;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#cost = cost;
    super.updateElement();
  }
}
