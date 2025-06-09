import {FilterType} from '../const.js';

export default class FiltersModel {
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
