import PointSortView from '../view/point-sort-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { updateItem } from '../utils.js';

export default class PointListPresenter {
  #container;
  #pointsModel;
  #pointSortComponent = new PointSortView();
  #pointListViewComponent = new PointListView();
  #emptyListComponent = new EmptyListView();

  #points = [];
  #pointPresenters = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    if (this.#points.length === 0) {
      render(this.#emptyListComponent, this.#container);
      return;
    }

    render(this.#pointSortComponent, this.#container);
    render(this.#pointListViewComponent, this.#container);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
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
