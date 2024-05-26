const BODY_ELEMENT = document.querySelector('body');
const HEADER_ELEMENT = BODY_ELEMENT.querySelector('.page-header');
const SITE_LIST_FILTER = HEADER_ELEMENT.querySelector('.trip-controls__filters');
const TRIP_MAIN = HEADER_ELEMENT.querySelector('.trip-main');
const EVENTS_LIST = BODY_ELEMENT.querySelector('.trip-events');
const ADD_POINT_BUTTON = document.querySelector('.trip-main__event-add-btn');

export {BODY_ELEMENT, HEADER_ELEMENT, SITE_LIST_FILTER, TRIP_MAIN, EVENTS_LIST, ADD_POINT_BUTTON};
