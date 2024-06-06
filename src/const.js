import dayjs from 'dayjs';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SORT_OPTIONS = {
  DAY: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).isBefore(secondPoint.dateFrom) ? -1 : 1,
  EVENT: (firstPoint, secondPoint) => (firstPoint.type.toLowerCase()).localeCompare(secondPoint.type.toLowerCase()),
  TIME: (firstPoint, secondPoint) => dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)) - dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom)),
  PRICE: (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice,
  OFFERS: (firstPoint, secondPoint) => firstPoint.offers.length - secondPoint.offers.length
};

const DEFAULT_SORT = SORT_OPTIONS.DAY;

const FILTER_OPTIONS = {
  EVERYTHING: () => true,
  FUTURE: (point) => dayjs(point.dateFrom).isAfter(dayjs(Date.now())),
  PRESENT: (point) => dayjs(point.dateFrom).isBefore(dayjs(Date.now())) && dayjs(point.dateTo).isAfter(dayjs(Date.now())),
  PAST: (point) => dayjs(point.dateTo).isBefore(dayjs(Date.now()))
};

const DEFAULT_FILTER = FILTER_OPTIONS.EVERYTHING;
const DEFAULT_FILTER_NAME = 'EVERYTHING';

const NO_ROUTE_POINTS_WARNING = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events',
  PRESENT: 'There are no current events',
  FUTURE: 'There are no future events',
  LOAD_FAIL: 'Failed to load latest route information'
};

const POINT_MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const USER_ACTION = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const DEFAULT_POINT_TYPE = 'flight';

const DEFAULT_DESTINATION_ID = null;

const DEFAULT_DESTINATION = {
  id: DEFAULT_DESTINATION_ID,
  description: '',
  name: '',
  pictures: [],
};

function DEFAULT_ROUTE_POINT() {
  return {
    basePrice: 0,
    dateFrom: null,
    dateTo:  null,
    destination: DEFAULT_DESTINATION_ID,
    isFavorite: false,
    offers: [],
    type: DEFAULT_POINT_TYPE
  };
}

const EDIT_POINT_VIEW_BUTTON_TEXT = {
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  LOAD_SAVE: 'Saving...',
  LOAD_DELETE: 'Deleting...'
};

const AUTHORIZATION = 'Basic qwertyuiopasdfghjklzxcvbnm0987654321';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const DATE_FORMAT = 'HH:mm';
const DATE_PERIODS = {
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MSEC_IN_SECOND: 1000,
  MSEC_IN_DAY: 24 * 60 * 60 * 1000,
  MSEC_IN_HUNDRED_DAYS : 24 * 60 * 60 * 1000 * 100,
  MSEC_IN_HOUR: 60 * 60 * 1000
};

const DEFAULT_DATE_FORMAT = 'MMM DD';
const DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export {POINT_TYPES,
  SORT_OPTIONS,
  DEFAULT_SORT,
  FILTER_OPTIONS,
  DEFAULT_FILTER,
  DEFAULT_FILTER_NAME,
  NO_ROUTE_POINTS_WARNING,
  POINT_MODE,
  EDIT_POINT_VIEW_BUTTON_TEXT,
  USER_ACTION,
  UPDATE_TYPE,
  DEFAULT_ROUTE_POINT,
  DEFAULT_DESTINATION,
  DEFAULT_DESTINATION_ID,
  DEFAULT_POINT_TYPE,
  AUTHORIZATION,
  END_POINT,
  DATE_PERIODS,
  DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT
};
