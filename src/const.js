const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const DEFAULT_POINT_TYPE = 'flight';

const MAX_VISIBLE_CITIES = 3;

const DateFormat = {
  EDIT_DATE_TIME: 'DD/MM/YY HH:mm',
  FLATPICKR: 'd/m/y H:i',
  ATTRIBUTE_DATE: 'YYYY-MM-DD',
  MONTH_DAY: 'MMM DD',
  TIME: 'HH:mm',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {
  TYPES,
  DEFAULT_POINT_TYPE,
  MAX_VISIBLE_CITIES,
  DateFormat,
  SortType,
  FilterType,
  UserAction,
  UpdateType,
};
