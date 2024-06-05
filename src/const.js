import dayjs from 'dayjs';
import {getDateDifference} from './utils';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Amsterdam', 'Paris', 'Berlin', 'Rome', 'London', 'Liverpool', 'Manchester', 'Stockholm', 'Helsinki', 'Moscow'];
const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ';

const PHOTO_ADDRESS = 'https://loremflickr.com/248/152?random=';

const RANDOM_NUMBER_MAX_LIMIT = 5000;
const RANDOM_NUMBER_MIN_LIMIT = 1;

const MAXIMUM_DAY_DIFFERENCE = 4;
const MAXIMUM_HOUR_DIFFERENCE = 23;
const MAXIMUM_MINUTE_DIFFERENCE = 59;

const OFFERS = [
  'Suite upgrade for luxury stay',
  'Book spa treatment',
  'Complimentary breakfast included every morning',
  'Request late check-out for convenience',
  'Join loyalty program for rewards',
  'Arrange airport transfer for convenience',
  'Upgrade rental car for comfort',
  'Guided city tour available',
  'Room with stunning view',
  'Book tickets for local attractions',
  'Personalize room with extra amenities',
  'Participate in on-site activities',
  'Upgrade Wi-Fi',
  'Arrange romantic dinner package',
  'Use hotel business center',
  'Request child-friendly amenities',
  'Book private airport lounge',
  'Order room service',
  'Access executive lounge for perks',
  'Guided hiking or biking tour',
  'Choose seats'
];

const SORT_OPTIONS = {
  DAY: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).isBefore(secondPoint.dateFrom) ? -1 : 1,
  EVENT: (firstPoint, secondPoint) => (firstPoint.type.toLowerCase()).localeCompare(secondPoint.type.toLowerCase()),
  TIME: (firstPoint, secondPoint) => getDateDifference(firstPoint.dateFrom, firstPoint.dateTo) <= getDateDifference(secondPoint.dateFrom, secondPoint.dateTo) ? -1 : 1,
  PRICE: (firstPoint, secondPoint) => firstPoint.basePrice - secondPoint.basePrice,
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
  EVERYTHING: 'Click New Event to create your first',
  PAST: 'There are no past events',
  PRESENT: 'There are no current events',
  FUTURE: 'There are no future events'
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

const AUTHORIZATION = 'Basic 12412412f';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

export {POINT_TYPES, CITIES, DESCRIPTION, OFFERS, PHOTO_ADDRESS};
export {RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT};
export {MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE, MAXIMUM_DAY_DIFFERENCE};
export {SORT_OPTIONS, DEFAULT_SORT, FILTER_OPTIONS, DEFAULT_FILTER, DEFAULT_FILTER_NAME, NO_ROUTE_POINTS_WARNING};
export {POINT_MODE, EDIT_POINT_VIEW_BUTTON_TEXT};
export {USER_ACTION, UPDATE_TYPE};
export {DEFAULT_ROUTE_POINT, DEFAULT_DESTINATION, DEFAULT_DESTINATION_ID, DEFAULT_POINT_TYPE};
export {AUTHORIZATION, END_POINT};
