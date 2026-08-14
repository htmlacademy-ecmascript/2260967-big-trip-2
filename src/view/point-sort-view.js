import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const SORT_ITEMS = [
  { type: SortType.DAY, label: 'Day', isEnabled: true },
  { type: 'event', label: 'Event', isEnabled: false },
  { type: SortType.TIME, label: 'Time', isEnabled: true },
  { type: SortType.PRICE, label: 'Price', isEnabled: true },
  { type: 'offer', label: 'Offers', isEnabled: false },
];

function createSortItemTemplate(item, currentSortType) {
  const { type, label, isEnabled } = item;
  const isChecked = isEnabled && type === currentSortType ? 'checked' : '';
  const isDisabled = isEnabled ? '' : 'disabled';
  const dataAttribute = isEnabled ? `data-sort-type="${type}"` : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${dataAttribute} ${isChecked} ${isDisabled}>
      <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>
  `;
}

function createPointSortForm(currentSortType) {
  const itemsTemplate = SORT_ITEMS
    .map((item) => createSortItemTemplate(item, currentSortType))
    .join('');

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${itemsTemplate}
    </form>
  `;
}

export default class PointSortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor(currentSortType, onSortTypeChange) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createPointSortForm(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
