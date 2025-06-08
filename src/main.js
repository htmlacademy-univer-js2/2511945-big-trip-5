import TripPresenter from './presenter/trip-presenter.js';
import PointModel, {FiltersModel} from './model/model.js';
import {render} from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api.js';

const siteMainElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');
const siteFiltersElement = document.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const apiService = new ApiService();
const pointsModel = new PointModel({apiService});
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  container: siteMainElement,
  pointsModel,
  filtersModel,
  newPointButton
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersElement,
  filtersModel,
  pointsModel
});

pointsModel.init()
  .then(() => {
    filterPresenter.init();
    tripPresenter.init();
  })
  .catch(() => {
    filterPresenter.init();
    tripPresenter.init();
  });
  