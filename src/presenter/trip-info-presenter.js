import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { formatDate } from '../utils.js';

export default class TripInfoPresenter {
  #container;
  #pointsModel;
  #tripInfoComponent = null;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = [...this.#pointsModel.points].sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom),
    );

    const prevComponent = this.#tripInfoComponent;

    if (points.length === 0) {
      if (prevComponent) {
        remove(prevComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const citiesText = this.#getCitiesText(points);
    const datesText = this.#getDatesText(points);
    const totalCost = this.#getTotalCost(points);

    this.#tripInfoComponent = new TripInfoView(citiesText, datesText, totalCost);

    if (prevComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevComponent);
    remove(prevComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #getCitiesText(points) {
    const cities = points.map(
      (point) => this.#pointsModel.getDestinationById(point.destination)?.name ?? '',
    );

    if (cities.length <= 3) {
      return cities.join(' &mdash; ');
    }

    return `${cities[0]} &mdash;...&mdash; ${cities[cities.length - 1]}`;
  }

  #getDatesText(points) {
    const start = formatDate(points[0].dateFrom);
    const end = formatDate(points[points.length - 1].dateTo);
    return `${start} &mdash; ${end}`;
  }

  #getTotalCost(points) {
    return points.reduce((sum, point) => {
      const offersPrice = this.#pointsModel
        .getOffersByIds(point.type, point.offers)
        .reduce((acc, offer) => acc + offer.price, 0);
      return sum + point.basePrice + offersPrice;
    }, 0);
  }
}
