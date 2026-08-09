import PointsApiService from './points-api-service.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic tr3fkbjfj45hggdh';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pageHeader = document.querySelector('.page-header');
const tripMainBlock = pageHeader.querySelector('.trip-main');
const filtersBlock = pageHeader.querySelector('.trip-controls__filters');
const newEventButton = pageHeader.querySelector('.trip-main__event-add-btn');
const pageMain = document.querySelector('.page-main');
const eventsSection = pageMain.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filtersBlock, filterModel, pointsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainBlock, pointsModel);
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
tripInfoPresenter.init();
pointListPresenter.init();
pointsModel.init();
