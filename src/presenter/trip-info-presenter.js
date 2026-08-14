import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { formatDate, sortByDay } from '../utils.js';
import { MAX_VISIBLE_CITIES } from '../const.js';
import he from 'he';

export default class TripInfoPresenter {
  #container;
  #pointsModel;
  #component = null;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = [...this.#pointsModel.points].sort(sortByDay);

    const prevComponent = this.#component;

    if (points.length === 0) {
      if (prevComponent) {
        remove(prevComponent);
        this.#component = null;
      }
      return;
    }

    const citiesText = this.#getCitiesText(points);
    const datesText = this.#getDatesText(points);
    const totalCost = this.#getTotalCost(points);

    this.#component = new TripInfoView(citiesText, datesText, totalCost);

    if (prevComponent === null) {
      render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#component, prevComponent);
    remove(prevComponent);
  }

  #getCitiesText(points) {
    const cities = points.map((point) => {
      const name = this.#pointsModel.getDestinationById(point.destination)?.name ?? '';
      return he.encode(name);
    });

    if (cities.length <= MAX_VISIBLE_CITIES) {
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
    return points.reduce((totalSum, point) => {
      const offersPrice = this.#pointsModel
        .getOffersByIds(point.type, point.offers)
        .reduce((offersSum, offer) => offersSum + offer.price, 0);
      return totalSum + point.basePrice + offersPrice;
    }, 0);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
