import PointSortView from '../view/point-sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointListPresenter {
  PointSortComponent = new PointSortView();
  PointListViewComponent = new PointListView();

  constructor(container, pointsModel) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    render(this.PointSortComponent, this.container);
    render(this.PointListViewComponent, this.container);

    const points = this.pointsModel.points;

    const firstPoint = points[0];
    const firstPointDestination = this.pointsModel.getDestinationById(firstPoint.destination);
    const firstPointOffers = this.pointsModel.getOffersByType(firstPoint.type);

    render(
      new PointEditView(firstPoint, firstPointDestination, firstPointOffers, this.pointsModel.destinations),
      this.PointListViewComponent.getElement()
    );

    points.forEach((point) => {
      this.renderPoint(point);
    });
  }

  renderPoint(point) {
    const destination = this.pointsModel.getDestinationById(point.destination);
    const offers = this.pointsModel.getOffersByIds(point.offers);

    const pointComponent = new PointView(point, destination, offers);

    render(pointComponent, this.PointListViewComponent.getElement());
  }
}
