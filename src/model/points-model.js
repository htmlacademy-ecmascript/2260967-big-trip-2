import {generatePoint, DESTINATIONS, OFFERS} from '../mock/point.js';

class PointsModel {
  constructor() {
    this.points = Array.from({length: 5}, generatePoint);
    this.destinations = DESTINATIONS;
    this.offers = OFFERS;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getOffersByIds(ids) {
    return this.offers.filter((offer) => ids.includes(offer.id));
  }

  getOffersByType(type) {
    return this.offers.filter((offer) => offer.type === type);
  }
}

export default PointsModel;
