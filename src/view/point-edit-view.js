import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { TYPES } from '../mock/point.js';

function createTypeItemTemplate(type, currentType) {
  const isChecked = type === currentType;
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeLabel}</label>
    </div>
  `;
}

function createTypesListTemplate(currentType) {
  return TYPES.map((type) => createTypeItemTemplate(type, currentType)).join('');
}

function createOfferSelectorTemplate(offer, checkedOfferIds) {
  const isChecked = checkedOfferIds.includes(offer.id);

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
}

function createOffersSectionTemplate(offers, checkedOfferIds) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => createOfferSelectorTemplate(offer, checkedOfferIds)).join('')}
      </div>
    </section>
  `;
}

function createDestinationsListTemplate(destinations) {
  if (!destinations || destinations.length === 0) {
    return '';
  }

  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createPointEditTemplate(point, destination, offers, destinations) {
  const startDate = dayjs(point.dateFrom).format('DD/MM/YY HH:mm');
  const endDate = dayjs(point.dateTo).format('DD/MM/YY HH:mm');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypesListTemplate(point.type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">${point.type}</label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationsListTemplate(destinations)}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersSectionTemplate(offers, point.offers)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination ? destination.description : ''}</p>
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView extends AbstractView {
  constructor(point, destination, offers, destinations, onFormSubmit) {
    super();
    this.point = point;
    this.destination = destination;
    this.offers = offers;
    this.destinations = destinations;
    this.onFormSubmit = onFormSubmit;

    this.element.querySelector('form')
      .addEventListener('submit', (evt) => {
        evt.preventDefault();
        this.onFormSubmit();
      });

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        this.onFormSubmit();
      });
  }

  get template() {
    return createPointEditTemplate(this.point, this.destination, this.offers, this.destinations);
  }
}
