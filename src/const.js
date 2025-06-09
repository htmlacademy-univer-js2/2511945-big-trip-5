export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

export const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date(Date.now() + 3600000).toISOString(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: PointType.FLIGHT
};
