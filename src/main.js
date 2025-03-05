import TripPresenter from './presenter/trip-presenter';
import TripFiltersView from './view/trip-filters-view';
import {render} from './render.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({tripContainer: tripEvents});

render(new TripFiltersView(), filtersElement);

tripPresenter.init();
