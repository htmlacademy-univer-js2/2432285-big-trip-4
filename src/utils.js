import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  MAXIMUM_MINUTE_DIFFERENCE,
  MAXIMUM_HOUR_DIFFERENCE,
  FILTER_OPTIONS,
  DEFAULT_FILTER, RANDOM_NUMBER_MIN_LIMIT, MAXIMUM_DAY_DIFFERENCE
} from './const';

dayjs.extend(duration);

const DATE_FORMAT = 'HH:mm';
const DATE_PERIODS = {
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MSEC_IN_SECOND: 1000,
  MSEC_IN_DAY: 24 * 60 * 60 * 1000,
  MSEC_IN_HOUR: 60 * 60 * 1000
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min, max) {
  const lowerNumber = Math.ceil(Math.min(min, max));
  const upperNumber = Math.floor(Math.max(min, max));

  return Math.floor(lowerNumber + Math.random() * (upperNumber - lowerNumber + 1));
}

function humanizeDate(dueDate, format = DATE_FORMAT) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDateDifference(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));

  let timeDifference = 0;
  switch (true) {
    case difference >= DATE_PERIODS.MSEC_IN_DAY:
      timeDifference = dayjs.duration(difference).format('DD[D] HH[H] mm[M]');
      break;
    case difference >= DATE_PERIODS.MSEC_IN_HOUR:
      timeDifference = dayjs.duration(difference).format('HH[H] mm[M]');
      break;
    case difference < DATE_PERIODS.MSEC_IN_HOUR:
      timeDifference = dayjs.duration(difference).format('mm[M]');
      break;
  }

  return timeDifference;
}

function getRandomDate(previousDate = 0) {
  let date;

  if (typeof previousDate !== 'number') {
    date = generateFutureDate(previousDate);
  } else {
    date = generateRandomDate();
  }

  checkDateValidity(date, previousDate);

  return date;
}

function generateFutureDate(previousDate) {
  return dayjs(previousDate)
    .add(getRandomNumber(0, MAXIMUM_HOUR_DIFFERENCE), 'hour')
    .add(getRandomNumber(0, MAXIMUM_MINUTE_DIFFERENCE), 'minute')
    .toDate();
}

function generateRandomDate() {
  const isPastDate = getRandomNumber(0, RANDOM_NUMBER_MIN_LIMIT);
  const date = isPastDate ?
    dayjs().subtract(getRandomNumber(0, MAXIMUM_DAY_DIFFERENCE), 'day') :
    dayjs();

  return date
    .add(getRandomNumber(0, MAXIMUM_HOUR_DIFFERENCE), 'hour')
    .add(getRandomNumber(0, MAXIMUM_MINUTE_DIFFERENCE), 'minute')
    .toDate();
}

function checkDateValidity(date, previousDate) {
  if (date < previousDate) {
    throw new Error(`New date ${date} is older than previous date ${previousDate}`);
  }
}


function getFilterButtonsToDisable(routePoints) {
  const buttonsToDisable = [];

  for (const [key, filter] of Object.entries(FILTER_OPTIONS)) {
    const filteredPoints = routePoints.filter(filter);
    if (filteredPoints.length === 0) {
      if (DEFAULT_FILTER === FILTER_OPTIONS[key]) {
        buttonsToDisable.push(...Object.keys(FILTER_OPTIONS));
        break;
      }

      buttonsToDisable.push(key);
    }
  }

  return buttonsToDisable;
}

function getTypeOffers(type, offersByTypes) {
  return offersByTypes.filter((obj) => obj.type === type)[0].offers;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomArrayElement , getRandomNumber, getRandomDate, humanizeDate, getDateDifference, getFilterButtonsToDisable,
  getTypeOffers, updateItem};
