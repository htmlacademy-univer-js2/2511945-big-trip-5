import { getRandomPoint } from "../mock/points.js";
import { mockDestinations } from "../mock/destinations.js";
import { mockOffers } from "../mock/offers.js";

const POINT_COUNT = 3;

export default class PointModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  getPoints() {
    return this.#points;
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
}
