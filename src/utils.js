import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MAXIMUM_MINUTE_DIFFERENCE, MAXIMUM_HOUR_DIFFERENCE} from './const';

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
  let date = dayjs();

  if (typeof previousDate !== 'number') {
    date = dayjs(date)
      .add(getRandomNumber(0, MAXIMUM_HOUR_DIFFERENCE), 'hour')
      .add(getRandomNumber(0, MAXIMUM_MINUTE_DIFFERENCE), 'minute')
      .toDate();
  }
  else {
    date = dayjs()
      .subtract(getRandomNumber(0, MAXIMUM_HOUR_DIFFERENCE), 'hour')
      .subtract(getRandomNumber(0, MAXIMUM_MINUTE_DIFFERENCE), 'minute')
      .toDate();
  }

  if (date < previousDate) {
    throw new Error(`New date is ${date} old date is ${previousDate}`);
  }

  return date;
}

export {getRandomArrayElement , getRandomNumber, getRandomDate, humanizeDate, getDateDifference};
