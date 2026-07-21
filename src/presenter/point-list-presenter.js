import PointSortView from '../view/point-sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { render } from '../render.js';

export default class PointListPresenter {
  #container;
  #pointsModel;
  #pointSortComponent = new PointSortView();
  #pointListViewComponent = new PointListView();
  #emptyListComponent = new EmptyListView();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      render(this.#emptyListComponent, this.#container);
      return;
    }

    render(this.#pointSortComponent, this.#container);
    render(this.#pointListViewComponent, this.#container);

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByIds(point.offers);
    const allTypeOffers = this.#pointsModel.getOffersByType(point.type);
    const allDestinations = this.#pointsModel.destinations;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const pointComponent = new PointView(point, destination, offers, () => {
      replacePointToForm();
    });

    const pointEditComponent = new PointEditView(point, destination, allTypeOffers, allDestinations, () => {
      replaceFormToPoint();
    });

    function replacePointToForm() {
      pointComponent.element.replaceWith(pointEditComponent.element);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint() {
      pointEditComponent.element.replaceWith(pointComponent.element);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#pointListViewComponent.element);
  }
}
