import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import { TYPES } from '../mock/point.js';
import 'flatpickr/dist/flatpickr.min.css';

function createTypesTemplate(currentType) {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>
  `).join('');
}

function createOffersTemplate(offers, checkedOfferIds) {
  if (!offers.length) {
    return '';
  }

  const items = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${checkedOfferIds.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${items}</div>
    </section>
  `;
}

function createPicturesTemplate(pictures) {
  if (!pictures || !pictures.length) {
    return '';
  }

  const items = pictures.map((picture) => `
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `).join('');

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">${items}</div>
    </div>
  `;
}

function createPointEditTemplate(state, destinations, offers) {
  const currentDestination = destinations.find((dest) => dest.id === state.destination);
  const typeOffers = offers.filter((offer) => offer.type === state.type);

  const startDate = dayjs(state.dateFrom).format('DD/MM/YY HH:mm');
  const endDate = dayjs(state.dateTo).format('DD/MM/YY HH:mm');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesTemplate(state.type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${state.type}</label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${state.basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersTemplate(typeOffers, state.offers)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination ? currentDestination.description : ''}</p>
            ${currentDestination ? createPicturesTemplate(currentDestination.pictures) : ''}
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, destinations, offers, onFormSubmit) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;

    this._setState(PointEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    const offersElement = this.element.querySelector('.event__available-offers');
    if (offersElement) {
      offersElement.addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selected = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selected ? selected.id : this._state.destination,
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #offersChangeHandler = (evt) => {
    const offerId = evt.target.dataset.offerId;
    const checkedOfferIds = this._state.offers;

    const nextOfferIds = evt.target.checked
      ? [...checkedOfferIds, offerId]
      : checkedOfferIds.filter((id) => id !== offerId);

    this._setState({
      offers: nextOfferIds,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate.toISOString(),
    });
    this.#datepickerTo.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate.toISOString(),
    });
    this.#datepickerFrom.set('maxDate', userDate);
  };

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }
}
