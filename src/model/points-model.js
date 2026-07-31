import Observable from '../framework/observable.js';
import {updateItem} from '../utils.js';
import {generatePoint, DESTINATIONS, OFFERS} from '../mock/point.js';

const POINTS_COUNT = 3;

class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, generatePoint);
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

  updatePoint(updateType, update) {
    this.#points = updateItem(this.#points, update);
    this._notify(updateType, update);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(updateType, point);
  }
}

export default PointsModel;
