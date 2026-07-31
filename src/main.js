import PointListPresenter from './presenter/point-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import TripInfoView from './view/trip-info-view.js';
import { render, RenderPosition } from './framework/render.js';
import { formatDate } from './utils.js';

const pageHeader = document.querySelector('.page-header');
const tripMainBlock = pageHeader.querySelector('.trip-main');
const filtersBlock = pageHeader.querySelector('.trip-controls__filters');
const newEventButton = pageHeader.querySelector('.trip-main__event-add-btn');
const pageMain = document.querySelector('.page-main');
const eventsSection = pageMain.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

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

render(new TripInfoView(citiesText, datesText, totalCost), tripMainBlock, RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(filtersBlock, filterModel, pointsModel);
const pointListPresenter = new PointListPresenter(eventsSection, pointsModel, filterModel);

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}

function handleNewEventButtonClick() {
  pointListPresenter.createPoint(handleNewPointFormClose);
  newEventButton.disabled = true;
}

newEventButton.addEventListener('click', handleNewEventButtonClick);

filterPresenter.init();
pointListPresenter.init();
