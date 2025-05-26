import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

function createEventEditTemplate(state) {
  const { point = {}, destination, offers } = state;
  const allOffers = mockOffers.find((offer) => offer.type === point.type)?.offers || [];
  const destinationData = mockDestinations.find((dest) => dest.id === point.destination) || destination;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant']
                        .map((type) => `
                          <div class="event__type-item">
                            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                          </div>
                        `).join('')}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${point.type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationData?.name || ''}" list="destination-list-1" placeholder=" ">
                  <datalist id="destination-list-1">
                    ${mockDestinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom ? dayjs(point.dateFrom).format('DD/MM/YY HH:mm') : ''}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo ? dayjs(point.dateTo).format('DD/MM/YY HH:mm') : ''}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice || ''}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                ${allOffers.length > 0 ? `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                      ${allOffers.map((offer) => `
                        <div class="event__offer-selector">
                          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" 
                            value="${offer.id}" ${point.offers?.includes(offer.id) ? 'checked' : ''}>
                          <label class="event__offer-label" for="event-offer-${offer.id}">
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
                            <img class="event__photo" src="${pic.src}" alt="${pic.description}">
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}
                  </section>
                ` : ''}
              </section>
            </form>
          </li>`;
}

export default class EventEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCancelClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = {}, onFormSubmit, onCancelClick }) {
    super();
    this._setState({
      point,
      destination: mockDestinations.find((dest) => dest.id === point.destination),
      offers: mockOffers.find((offer) => offer.type === point.type)?.offers || []
    });

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state);
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
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    
    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#cancelClickHandler);
    
    this.element.querySelector('.event__reset-btn')
      ?.addEventListener('click', this.#cancelClickHandler);

    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#typeToggleHandler);

    const destinationInput = this.element.querySelector('.event__input--destination');
    destinationInput.addEventListener('change', this.#destinationChangeHandler);
    destinationInput.addEventListener('click', this.#showDestinationList);
    destinationInput.addEventListener('focus', this.#showDestinationList);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    const [dateFromInput, dateToInput] = this.element.querySelectorAll('.event__input--time');
    
    this.#datepickerFrom = flatpickr(
      dateFromInput,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.point.dateFrom,
        onChange: this.#dateFromChangeHandler
      }
    );
    
    this.#datepickerTo = flatpickr(
      dateToInput,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate.toISOString()
      }
    });
    this.#datepickerTo.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
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
    if (evt.target.name !== 'event-type') {
      return;
    }

    const newType = evt.target.value;
    const newOffers = mockOffers.find((offer) => offer.type === newType)?.offers || [];

    this.updateElement({
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      },
      offers: newOffers
    });
  };

  #showDestinationList = (evt) => {
    evt.target.value = '';
    setTimeout(() => {
      evt.target.value = this._state.destination?.name || '';
    }, 0);
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = mockDestinations.find((dest) => dest.name === evt.target.value);
    if (!selectedDestination) {
      evt.target.setCustomValidity('Please select a destination from the list');
      evt.target.reportValidity();
      return;
    }
  
    evt.target.setCustomValidity('');
    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestination.id
      },
      destination: selectedDestination
    });
  };

  #priceChangeHandler = (evt) => {
    const price = parseInt(evt.target.value, 10);
    if (isNaN(price) || price <= 0) {
      evt.target.setCustomValidity('Please enter a valid positive number');
      evt.target.reportValidity();
      return;
    }
  
    evt.target.setCustomValidity('');
    this._setState({
      point: {
        ...this._state.point,
        basePrice: price
      }
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.name.includes('event-offer')) {
      return;
    }

    const offerId = evt.target.value;
    const offers = this._state.point.offers || [];
    const newOffers = evt.target.checked
      ? [...offers, offerId]
      : offers.filter((id) => id !== offerId);

    this._setState({
      point: {
        ...this._state.point,
        offers: newOffers
      }
    });
  };
}
