import {getRandomPoint} from '../mock/points.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';
import {UpdateType} from '../const.js';

const POINT_COUNT = 3;

export class FiltersModel {
  #filter = 'everything';
  #observers = [];

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
    this.#notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}

export default class PointModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;
  #observers = [];

  getPoints(filterType = 'everything') {
    const now = new Date();
    
    switch (filterType) {
      case 'future':
        return this.#points.filter((point) => new Date(point.dateFrom) > now);
      case 'present':
        return this.#points.filter((point) => 
          new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now);
      case 'past':
        return this.#points.filter((point) => new Date(point.dateTo) < now);
      default:
        return [...this.#points];
    }
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getDestinationsById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers(updateType, data) {
    this.#observers.forEach((observer) => observer(updateType, data));
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    
    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];

    this.#notifyObservers(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [newPoint, ...this.#points];
    this.#notifyObservers(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);
    
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this.#notifyObservers(updateType, deletedPoint);
  }
}
