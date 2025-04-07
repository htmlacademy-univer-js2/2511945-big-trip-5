import TripPresenter from './presenter/trip-presenter.js';
import TripFiltersView from './view/trip-filters-view.js';
import {render} from './framework/render.js';
import PointModel from './model/model.js';
import {generateFilterItems} from './mock/filter.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointModel();
const tripPresenter = new TripPresenter({
  tripContainer: tripEvents,
  pointsModel: pointsModel,
});

const filterItems = generateFilterItems(pointsModel.getPoints());
render(new TripFiltersView(filterItems), filtersElement);

tripPresenter.init();
