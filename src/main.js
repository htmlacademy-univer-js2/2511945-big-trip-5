import TripPresenter from './presenter/trip-presenter';
import TripFiltersView from './view/trip-filters-view';
import {render} from './render.js';
import PointModel from './model/model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const pointsModel = new PointModel();
const tripPresenter = new TripPresenter({
    tripContainer: tripEvents,
    pointsModel,
});

render(new TripFiltersView(), filtersElement);

tripPresenter.init();