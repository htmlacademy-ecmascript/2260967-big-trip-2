import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';
import he from 'he';
import { getDuration } from '../utils.js';
import { DateFormat } from '../const.js';

function createOffersTemplate(offers) {
  if (!offers || offers.length === 0) {
    return '';
  }
  return offers.map((offer) => `
    <li class="event__offer">
    <span class="event__offer-title">${he.encode(offer.title)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
}

function createPointTemplate(point, destination, offers) {
  const dateForAttribute = dayjs(point.dateFrom).format(DateFormat.ATTRIBUTE_DATE);
  const dateLabel = dayjs(point.dateFrom).format(DateFormat.MONTH_DAY).toUpperCase();
  const startTime = dayjs(point.dateFrom).format(DateFormat.TIME);
  const endTime = dayjs(point.dateTo).format(DateFormat.TIME);
  const duration = getDuration(point.dateFrom, point.dateTo);
  const destinationName = destination ? he.encode(destination.name) : '';

  const favoriteClassName = point.isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `
         <li class="trip-events__item">
              <div class="event">
              <time class="event__date" datetime="${dateForAttribute}">${dateLabel}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${he.encode(point.type)} ${destinationName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${point.dateFrom}">${startTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${point.dateTo}">${endTime}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
   <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>
                <button class="${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>
  `;
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor(point, destination, offers, onRollupClick, onFavoriteClick) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
