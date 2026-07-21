import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import TripFilterView from './view/trip-filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import { render, RenderPosition } from './framework/render.js';
import { formatDate, isPointFuture, isPointPresent, isPointPast } from './utils.js';

const pageHeader = document.querySelector('.page-header');
const tripMainBlock = pageHeader.querySelector('.trip-main');
const filtersBlock = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsSection = pageMain.querySelector('.trip-events');

const pointsModel = new PointsModel();

const points = pointsModel.points;

const citiesText = points
  .map((point) => pointsModel.getDestinationById(point.destination).name)
  .join(' &mdash; ');

const datesText = points.length
  ? `${formatDate(points[0].dateFrom)} &mdash; ${formatDate(points[points.length - 1].dateTo)}`
  : '';

const totalCost = points.reduce((sum, point) => {
  const offersSum = pointsModel.getOffersByIds(point.offers)
    .reduce((acc, offer) => acc + offer.price, 0);
  return sum + point.basePrice + offersSum;
}, 0);

const filters = {
  isFutureDisabled: !points.some(isPointFuture),
  isPresentDisabled: !points.some(isPointPresent),
  isPastDisabled: !points.some(isPointPast),
};

render(new TripInfoView(citiesText, datesText, totalCost), tripMainBlock, RenderPosition.AFTERBEGIN);
render(new TripFilterView(filters), filtersBlock);

const presenter = new PointListPresenter(eventsSection, pointsModel);
presenter.init();
