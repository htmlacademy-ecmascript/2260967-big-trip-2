import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import { TYPES, DateFormat } from '../const.js';
import 'flatpickr/dist/flatpickr.min.css';

function createTypesTemplate(currentType, isDisabled) {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>
  `).join('');
}

function createOffersTemplate(offers, checkedOfferIds, isDisabled) {
  if (!offers.length) {
    return '';
  }

  const items = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${checkedOfferIds.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${he.encode(offer.title)}</span>
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
    <img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">
  `).join('');

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">${items}</div>
    </div>
  `;
}

function createDestinationTemplate(destination) {
  if (!destination) {
    return '';
  }

  const hasDescription = destination.description?.length;
  const hasPictures = destination.pictures?.length;

  if (!hasDescription && !hasPictures) {
    return '';
  }

  const description = hasDescription
    ? `<p class="event__destination-description">${he.encode(destination.description)}</p>`
    : '';

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description}
      ${createPicturesTemplate(destination.pictures)}
    </section>
  `;
}

function createPointEditTemplate(state, destinations, offers, isNewPoint) {
  const currentDestination = destinations.find((destination) => destination.id === state.destination);
  const typeOffers = offers.find((offer) => offer.type === state.type)?.offers ?? [];

  const startDate = dayjs(state.dateFrom).format(DateFormat.EDIT_DATE_TIME);
  const endDate = dayjs(state.dateTo).format(DateFormat.EDIT_DATE_TIME);

  const editButtonText = state.isDeleting ? 'Deleting...' : 'Delete';
  const resetButtonText = isNewPoint ? 'Cancel' : editButtonText;

  const rollupButtonTemplate = isNewPoint
    ? ''
    : `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;
  const destinationName = currentDestination ? he.encode(currentDestination.name) : '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${state.isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesTemplate(state.type, state.isDisabled)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${state.type}</label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" ${state.isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinations.map((destination) => `<option value="${he.encode(destination.name)}"></option>`).join('')}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}" ${state.isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}" ${state.isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${state.basePrice}" ${state.isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${state.isDisabled ? 'disabled' : ''}>${state.isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${state.isDisabled ? 'disabled' : ''}>${resetButtonText}</button>
          ${rollupButtonTemplate}
        </header>
        <section class="event__details">
          ${createOffersTemplate(typeOffers, state.offers, state.isDisabled)}
          ${createDestinationTemplate(currentDestination)}
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleRollupClick = null;
  #isNewPoint = false;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, destinations, offers, onFormSubmit, onDeleteClick, onRollupClick, isNewPoint = false) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleRollupClick = onRollupClick;
    this.#isNewPoint = isNewPoint;

    this._setState(PointEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
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

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    const element = this.element;

    element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    const rollupButton = element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    const offersElement = element.querySelector('.event__available-offers');
    if (offersElement) {
      offersElement.addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: DateFormat.FLATPICKR,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: DateFormat.FLATPICKR,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
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
    const selected = this.#destinations.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: selected ? selected.id : this._state.destination,
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: evt.target.valueAsNumber,
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

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
