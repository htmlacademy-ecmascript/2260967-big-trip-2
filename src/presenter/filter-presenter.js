import TripFilterView from '../view/trip-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils.js';

const FILTER_NAMES = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PRESENT]: 'Present',
  [FilterType.PAST]: 'Past',
};

export default class FilterPresenter {
  #container;
  #filterModel;
  #pointsModel;
  #filterComponent = null;

  constructor(container, filterModel, pointsModel) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      name: FILTER_NAMES[type],
      count: filter[type](points).length,
    }));
  }

  init() {
    const filters = this.filters;
    const currentFilterType = this.#filterModel.filter;

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFilterView(
      filters,
      currentFilterType,
      this.#handleFilterTypeChange,
    );

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
