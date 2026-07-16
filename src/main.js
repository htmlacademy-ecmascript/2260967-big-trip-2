import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import TripFilterView from './view/trip-filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import { render, RenderPosition } from './render.js';

const pageHeader = document.querySelector('.page-header');
const tripMainBlock = pageHeader.querySelector('.trip-main');
const filtersBlock = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const eventsSection = pageMain.querySelector('.trip-events');

render(new TripInfoView(), tripMainBlock, RenderPosition.AFTERBEGIN);
render(new TripFilterView(), filtersBlock);

const pointsModel = new PointsModel();
const presenter = new PointListPresenter(eventsSection, pointsModel);
presenter.init();
