import { UpdateType } from './const.js';

const AUTHORIZATION = 'Basic eo0w590ik29889b';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

export default class ApiService {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    this.#points = [];
    this.#destinations = [];
    this.#offers = [];
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#loadPoints(),
        this.#loadDestinations(),
        this.#loadOffers()
      ]);

      this.#points = points;
      this.#destinations = destinations;
      this.#offers = offers;

      return {
        points: this.#points,
        destinations: this.#destinations,
        offers: this.#offers
      };
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      throw new Error('Failed to load data from server');
    }
  }

  async #loadPoints() {
    const response = await this.#sendRequest({
      url: 'points',
      method: 'GET'
    });

    return response.map(this.#adaptToClient);
  }

  async #loadDestinations() {
    return await this.#sendRequest({
      url: 'destinations',
      method: 'GET'
    });
  }

  async #loadOffers() {
    return await this.#sendRequest({
      url: 'offers',
      method: 'GET'
    });
  }

  async updatePoint(update) {
    const response = await this.#sendRequest({
      url: `points/${update.id.replace('#', '')}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(update)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const updatedPoint = this.#adaptToClient(response);
    return updatedPoint;
  }

  async #sendRequest({url, method = 'GET', body = null, headers = new Headers()}) {
    headers.append('Authorization', AUTHORIZATION);

    const response = await fetch(`${END_POINT}/${url}`, {method, body, headers});

    if (!response.ok) {
      throw new Error(`Failed to ${method} ${url}: ${response.status}`);
    }

    return await response.json();
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
