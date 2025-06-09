import { UpdateType } from './const.js';

const AUTHORIZATION = 'Basic eo0w590ik29889b';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

export default class ApiService {
  constructor() {
    this._points = [];
    this._destinations = [];
    this._offers = [];
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this._loadPoints(),
        this._loadDestinations(),
        this._loadOffers()
      ]);

      this._points = points;
      this._destinations = destinations;
      this._offers = offers;

      return {
        points: this._points,
        destinations: this._destinations,
        offers: this._offers
      };
    } catch (err) {
      throw new Error('Failed to load data from server');
    }
  }

  async getPoints() {
    return this._points;
  }

  async getDestinations() {
    return this._destinations;
  }

  async getOffers() {
    return this._offers;
  }

  async addPoint(point) {
    const response = await this._sendRequest({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(this._adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return this._adaptToClient(response);
  }

  async updatePoint(point) {
    const response = await this._sendRequest({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(this._adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return this._adaptToClient(response);
  }

  async deletePoint(point) {
    await this._sendRequest({
      url: `points/${point.id}`,
      method: 'DELETE'
    });
  }

  async _loadPoints() {
    const response = await this._sendRequest({
      url: 'points',
      method: 'GET'
    });

    return response.map(this._adaptToClient);
  }

  async _loadDestinations() {
    return await this._sendRequest({
      url: 'destinations',
      method: 'GET'
    });
  }

  async _loadOffers() {
    return await this._sendRequest({
      url: 'offers',
      method: 'GET'
    });
  }

  async _sendRequest({url, method = 'GET', body = null, headers = new Headers()}) {
    headers.append('Authorization', AUTHORIZATION);

    const response = await fetch(`${END_POINT}/${url}`, {method, body, headers});

    if (!response.ok) {
      throw new Error(`Failed to ${method} ${url}: ${response.status}`);
    }

    return await response.json();
  }

  _adaptToClient(point) {
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

  _adaptToServer(point) {
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
