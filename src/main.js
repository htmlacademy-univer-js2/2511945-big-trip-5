import TripPresenter from './presenter/trip-presenter.js';
import PointModel, {FiltersModel} from './model/model.js';
import {render} from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteMainElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');
const siteFiltersElement = document.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointModel();
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

filterPresenter.init();
tripPresenter.init();
