export default class FilterModel {
  #filter = 'everything';

  get filter() {
    return this.#filter;
  }

  set filter(newFilter) {
    this.#filter = newFilter;
  }
}
