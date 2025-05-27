import { getRandomPoint } from "../mock/points.js";
import { mockDestinations } from "../mock/destinations.js";
import { mockOffers } from "../mock/offers.js";

const POINT_COUNT = 3;

export default class PointModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;
  #filterModel = null;

  constructor(filterModel) {
    this.#filterModel = filterModel;
  }

  get points() {
    return this.#points;
  }

  set points(newPoints) {
    this.#points = newPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
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
    return offersType?.offers.filter((item) => itemsId.find((id) => item.id === id)) || [];
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    
    if (index === -1) {
      return;
    }
    
    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];
  }

  addPoint(newPoint) {
    this.#points = [...this.#points, newPoint];
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
  }

  getFilteredPoints() {
    const filterType = this.#filterModel?.filter;
    if (!filterType || filterType === 'everything') {
      return this.#points;
    }

    const now = new Date();
    return this.#points.filter((point) => {
      const dateFrom = new Date(point.date_from);
      const dateTo = new Date(point.date_to);

      switch (filterType) {
        case 'future':
          return dateFrom > now;
        case 'present':
          return dateFrom <= now && dateTo >= now;
        case 'past':
          return dateTo < now;
        default:
          return true;
      }
    });
  }
}
