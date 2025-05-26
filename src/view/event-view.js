import AbstractView from '../framework/view/abstract-view.js';

function createEventTemplate(point = {}, destinations = [], offers = []) {
  const destination = destinations.find((dest) => dest.id === point.destination) || {};
  const destinationName = destination.name || '';

  const typeOffers = offers.find((offer) => offer.type === point.type)?.offers || [];
  const pointOffers = Array.isArray(point.offers) ? point.offers : [];
  const selectedOffers = typeOffers.filter((offer) => pointOffers.includes(offer.id));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatDay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  const getDuration = (start, end) => {
    if (!start || !end) return '';
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000) % 24;
    const days = Math.floor(diff / 86400000);
    
    return [
      days > 0 ? `${days}D` : '',
      hours > 0 ? `${hours}H` : '',
      `${minutes}M`
    ].filter(Boolean).join(' ');
  };

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${point.date_from}">${formatDay(point.date_from)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type || ''}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type || ''} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.date_from}">${formatDate(point.date_from)}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.date_to}">${formatDate(point.date_to)}</time>
          </p>
          <p class="event__duration">${getDuration(point.date_from, point.date_to)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.base_price || ''}</span>
        </p>
        ${selectedOffers.length > 0 ? `
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${selectedOffers.map((offer) => `
              <li class="event__offer">
                <span class="event__offer-title">${offer.title || ''}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price || ''}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class EventView extends AbstractView {
  #point = {};
  #destinations = [];
  #offers = [];
  #handleEditClick = () => {};

  constructor({ point = {}, destinations = [], offers = [], onEditClick = () => {} }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
