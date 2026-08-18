import { nanoid } from 'nanoid';
import PointsApiService from './points-api-service.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import { render } from './framework/render.js';

const AUTHORIZATION = `Basic ${nanoid()}`;
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const eventsElement = pageMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const pointListPresenter = new PointListPresenter(eventsElement, pointsModel, filterModel);

const newPointButtonComponent = new NewPointButtonView(handleNewPointButtonClick);

function handleNewPointFormClose() {
  newPointButtonComponent.setDisabled(false);
}

function handleNewPointButtonClick() {
  pointListPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.setDisabled(true);
}

render(newPointButtonComponent, tripMainElement);

filterPresenter.init();
tripInfoPresenter.init();
pointListPresenter.init();
pointsModel.init();
