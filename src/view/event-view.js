import AbstractView from "../framework/view/abstract-view.js";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function createEventTemplate(point) {
  const destinationData = mockDestinations.find(dest => dest.id === point.destination);
  const destinationName = destinationData?.name || 'No destination specified';
  
  const {type, dateFrom, dateTo, basePrice, isFavorite, offers: selectedOffers} = point;
  
  const allOffers = mockOffers.find((offer) => offer.type === type)?.offers || [];
  const offersToDisplay = allOffers.filter(offer => selectedOffers?.includes(offer.id));

  const startDate = dayjs(dateFrom).format('MMM DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const duration = calculateDuration(dateFrom, dateTo);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice ?? ''}</span>
        </p>
        ${offersToDisplay.length > 0 ? `
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersToDisplay.map(offer => `
              <li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

function calculateDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const durationObj = dayjs.duration(diff);

  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
}

export default class EventView extends AbstractView {
  #handleEditClick = null;
  #handleFavoriteClick = null;
  #point = null;

  constructor({point, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')?.addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
