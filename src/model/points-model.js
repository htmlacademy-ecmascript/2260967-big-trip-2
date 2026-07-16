import {generatePoint, DESTINATIONS, OFFERS} from '../mock/point.js';

class PointsModel {
  #points = Array.from({length: 5}, generatePoint);
  #destinations = DESTINATIONS;
  #offers = OFFERS;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByIds(ids) {
    return this.#offers.filter((offer) => ids.includes(offer.id));
  }

  getOffersByType(type) {
    return this.#offers.filter((offer) => offer.type === type);
  }
}

export default PointsModel;
