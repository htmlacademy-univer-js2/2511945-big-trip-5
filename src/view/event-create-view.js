import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs().toISOString(),
  dateTo: dayjs().add(1, 'day').toISOString(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const createEventCreateTemplate = (state) => {
  const { point = BLANK_POINT, destinations, offers } = state;
  const currentOffers = mockOffers.find((offer) => offer.type === point.type)?.offers || [];
  const destinationData = destinations.find((dest) => dest.id === point.destination);

  return `
    <li class="trip-events__item event-form">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-new">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-new" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant']
                  .map((type) => `
                    <div class="event__type-item">
                      <input id="event-type-${type}-new" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
                      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-new">${type}</label>
                    </div>
                  `).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-new">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-new" type="text" name="event-destination" value="${destinationData?.name || ''}" list="destination-list-new" required>
            <datalist id="destination-list-new">
              ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-new">From</label>
            <input class="event__input  event__input--time" id="event-start-time-new" type="text" name="event-start-time" value="${dayjs(point.dateFrom).format('DD/MM/YY HH:mm')}" required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-new">To</label>
            <input class="event__input  event__input--time" id="event-end-time-new" type="text" name="event-end-time" value="${dayjs(point.dateTo).format('DD/MM/YY HH:mm')}" required>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-new">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-new" type="number" name="event-price" value="${point.basePrice}" min="0" required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>

        <section class="event__details">
          ${currentOffers.length > 0 ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${currentOffers.map((offer) => `
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-new" type="checkbox" name="event-offer" value="${offer.id}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
                    <label class="event__offer-label" for="event-offer-${offer.id}-new">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </label>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${destinationData ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationData.description}</p>
              ${destinationData.pictures?.length > 0 ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destinationData.pictures.map((pic) => `
                      <img class="event__photo" src="${pic.src}" alt="${pic.description}" onerror="this.style.display='none'">
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    </li>
  `;
};

export default class EventCreateView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCancelClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ destinations, offers, onFormSubmit, onCancelClick }) {
    super();
    this._setState({
      point: BLANK_POINT,
      destinations,
      offers
    });

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventCreateTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  #setDatepickers() {
    const [dateFromInput, dateToInput] = this.element.querySelectorAll('.event__input--time');
    
    this.#datepickerFrom = flatpickr(dateFromInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      defaultDate: this._state.point.dateFrom,
      onChange: this.#dateFromChangeHandler
    });
    
    this.#datepickerTo = flatpickr(dateToInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      defaultDate: this._state.point.dateTo,
      minDate: this._state.point.dateFrom,
      onChange: this.#dateToChangeHandler
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDate.toISOString()
      }
    });
    this.#datepickerTo.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDate.toISOString()
      }
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state.point);
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #typeToggleHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }

    const newType = evt.target.value;
    const newOffers = this._state.offers.find((offer) => offer.type === newType)?.offers || [];

    this.updateElement({
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this._state.destinations.find((dest) => dest.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        point: {
          ...this._state.point,
          destination: selectedDestination.id
        }
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        basePrice: parseInt(evt.target.value, 10) || 0
      }
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.name.includes('event-offer')) {
      return;
    }

    const offerId = evt.target.value;
    const offers = this._state.point.offers;
    const newOffers = evt.target.checked
      ? [...offers, offerId]
      : offers.filter((id) => id !== offerId);

    this.updateElement({
      point: {
        ...this._state.point,
        offers: newOffers
      }
    });
  };
}
