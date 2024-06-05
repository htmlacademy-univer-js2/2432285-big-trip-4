import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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

function humanizeDate(dueDate, format = DATE_FORMAT) {
  if (dueDate === null) {
    return '';
  }

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


function getTypeOffers(type, offersByTypes) {
  return offersByTypes.filter((obj) => obj.type === type)[0].offers;
}

function getTripInfoTitle(cities) {
  if (cities.length > 3) {
    return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  } else {
    return cities.reduce((acc, city, index) => {
      if (index !== cities.length - 1) {
        acc += `${city} &mdash; `;
      } else {
        acc += `${city}`;
      }
      return acc;
    }, '');
  }
}

function getTripInfoStartDate(sortedPoints) {
  return sortedPoints[0] ? dayjs(sortedPoints[0].dateFrom).format('MMM DD') : '';
}

function getTripInfoEndDate(sortedPoints) {
  if (!sortedPoints[0]) {
    return ';';
  }

  const startDate = sortedPoints[0].dateFrom;

  const endDate = sortedPoints[sortedPoints.length - 1].dateTo;
  if (dayjs(startDate).format('MMM') === dayjs(endDate).format('MMM')) {
    return dayjs(endDate).format('DD');
  } else {
    return dayjs(endDate).format('MMM DD');
  }
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.basePrice ?? 0),
    0
  );
}

function getTripCost(points = [], offers = []) {
  return points.reduce(
    (result, point) =>
      result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
    0);
}

export {humanizeDate, getDateDifference, getTypeOffers, getTripInfoEndDate, getTripInfoStartDate, getTripInfoTitle, getTripCost};
