import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import PointModel from './model/model.js';
import FilterModel from './model/filter-model.js';
import { generateFilterItems } from './mock/filter.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const pointsModel = new PointModel(filterModel);

const tripPresenter = new TripPresenter({
  tripContainer: tripEvents,
  pointsModel: pointsModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel: filterModel,
  pointsModel: pointsModel
});

filterPresenter.init();
tripPresenter.init();

newEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
