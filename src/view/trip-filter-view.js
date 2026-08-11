import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, name, count } = filter;
  const isChecked = type === currentFilterType ? 'checked' : '';
  const isDisabled = count === 0 && type !== currentFilterType ? 'disabled' : '';

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked}
        ${isDisabled}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>
  `;
}

function createTripFilter(filters, currentFilterType) {
  const itemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${itemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor(filters, currentFilterType, onFilterTypeChange) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripFilter(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
