import TripFilterView from '../view/trip-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils.js';

const FilterName = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PRESENT]: 'Present',
  [FilterType.PAST]: 'Past',
};

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #component = null;

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
      name: FilterName[type],
      count: filter[type](points).length,
    }));
  }

  init() {
    const filters = this.filters;
    const currentFilterType = this.#filterModel.filter;

    const prevComponent = this.#component;

    this.#component = new TripFilterView(
      filters,
      currentFilterType,
      this.#handleFilterTypeChange,
    );

    if (prevComponent === null) {
      render(this.#component, this.#container);
      return;
    }

    replace(this.#component, prevComponent);
    remove(prevComponent);
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

