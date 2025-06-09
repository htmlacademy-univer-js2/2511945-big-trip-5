import {UpdateType, FilterType} from '../const.js';

export default class PointsModel {
  #points = [];
  #destinations = [];
  #offers = [];
  #apiService = null;
  #isLoading = true;
  #observers = [];

  constructor({apiService}) {
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
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
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      throw new Error('Failed to load data');
    } finally {
      this.#isLoading = false;
    }

    this.#notifyObservers(UpdateType.INIT);
  }

  getFilteredPoints(filterType) {
    const now = new Date();
    
    switch (filterType) {
      case FilterType.FUTURE:
        return this.#points.filter((point) => new Date(point.dateFrom) > now);
      case FilterType.PRESENT:
        return this.#points.filter((point) => 
          new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now);
      case FilterType.PAST:
        return this.#points.filter((point) => new Date(point.dateTo) < now);
      default:
        return [...this.#points];
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#apiService.addPoint(update);
      const adaptedPoint = this.#adaptToClient(response);
      
      this.#points = [adaptedPoint, ...this.#points];
      this.#notifyObservers(updateType, adaptedPoint);
    } catch(err) {
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    
    try {
      const response = await this.#apiService.updatePoint(update);
      const adaptedPoint = this.#adaptToClient(response);
      
      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1)
      ];

      this.#notifyObservers(updateType, adaptedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    
    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];
      this.#notifyObservers(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers(updateType, data) {
    this.#observers.forEach((observer) => observer(updateType, data));
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

export class FiltersModel {
  #filter = FilterType.EVERYTHING;
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
