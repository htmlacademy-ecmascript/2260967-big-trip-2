import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(citiesText, datesText, totalCost) {
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesText}</h1>
        <p class="trip-info__dates">${datesText}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #citiesText = null;
  #datesText = null;
  #totalCost = null;

  constructor(citiesText, datesText, totalCost) {
    super();
    this.#citiesText = citiesText;
    this.#datesText = datesText;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate(this.#citiesText, this.#datesText, this.#totalCost);
  }
}
