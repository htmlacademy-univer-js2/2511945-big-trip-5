import {UpdateType} from '../const.js';

export class FiltersModel {
  #filter = 'everything';
  #observers = [];

  get filter() {
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
  #points = [];
  #destinations = [];
  #offers = [];
  #observers = [];
  #apiService = null;
  #isLoading = true;

  constructor({apiService}) {
    this.#apiService = apiService;
  }

  get isLoading() {
    return this.#isLoading;
  }

  async init() {
    try {
      const data = await this.#apiService.init();
      this.#points = data.points.map(this.#adaptToClient);
      this.#destinations = data.destinations;
      this.#offers = data.offers;
      this.#isLoading = false;
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isLoading = false;
      throw new Error('Failed to load data');
    }

    this.#notifyObservers(UpdateType.INIT);
  }

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

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers(updateType, data) {
    this.#observers.forEach((observer) => observer(updateType, data));
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const adaptedPoint = this.#adaptToClient(response);
      
      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1)
      ];

      this.#notifyObservers(updateType, adaptedPoint);
      return adaptedPoint;
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      isFavorite: point.isFavorite || false,
      offers: point.offers || []
    };

    return adaptedPoint;
  }
}
