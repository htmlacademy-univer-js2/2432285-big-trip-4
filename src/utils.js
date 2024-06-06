import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {DATE_FORMAT, DATE_PERIODS} from './const';

dayjs.extend(duration);

function humanizeDate(dueDate, format = DATE_FORMAT) {
  if (dueDate === null) {
    return '';
  }

  return dueDate ? dayjs(dueDate).format(format) : '';
}

function getDateDifference(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');

  let timeDifference = 0;
  switch (true) {
    case difference >= DATE_PERIODS.MSEC_IN_HUNDRED_DAYS:
      timeDifference = dayjs.duration(difference).format(`${days}[D] HH[H] mm[M]`);
      break;
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

function getTripInfoTitle(destinations) {
  if (destinations.length > 3) {
    return `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
  }

  return destinations.join(' &mdash; ');
}

function getTripInfoStartDate(sortedPoints) {
  return sortedPoints[0] ? dayjs(sortedPoints[0].dateFrom).format('DD MMM') : '';
}

function getTripInfoEndDate(sortedPoints) {
  if (!sortedPoints[0]) {
    return '';
  }

  const startDate = dayjs(sortedPoints[0].dateFrom);
  const endDate = dayjs(sortedPoints[sortedPoints.length - 1].dateTo);

  return startDate.format('MMM') === endDate.format('MMM')
    ? endDate.format('DD MMM')
    : endDate.format('DD MMM');
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0
  );
}

function getTripCost(points = [], offers = []) {
  return points.reduce(
    (result, point) =>
      result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
    0
  );
}

export {humanizeDate, getDateDifference, getTypeOffers, getTripInfoEndDate, getTripInfoStartDate, getTripInfoTitle, getTripCost};
