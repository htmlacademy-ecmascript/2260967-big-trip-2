import PointSortView from '../view/point-sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { updateItem, sortByDay, sortByTime, sortByPrice } from '../utils.js';
import { SortType } from '../const.js';

export default class PointListPresenter {
  #container;
  #pointsModel;
  #pointListViewComponent = new PointListView();
  #emptyListComponent = new EmptyListView();
  #pointSortComponent = null;

  #points = [];
  #sourcedPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];

    if (this.#points.length === 0) {
      render(this.#emptyListComponent, this.#container);
      return;
    }

    this.#sortPoints(this.#currentSortType);
    this.#renderSort();
    render(this.#pointListViewComponent, this.#container);
    this.#renderPoints();
  }

  #renderSort() {
    this.#pointSortComponent = new PointSortView(this.#handleSortTypeChange);
    render(this.#pointSortComponent, this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }


    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points.sort(sortByDay);
    }

    this.#currentSortType = sortType;
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this.#pointListViewComponent.element,
      this.#pointsModel,
      this.#handleDataChange,
      this.#handleModeChange,
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
