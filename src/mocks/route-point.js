import {POINT_TYPES, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomArrayElement, getRandomNumber, getRandomDate} from '../utils';
import {generateRandomDestination} from './destinations';

function generateRoutePoint(offersByTypes) {
  const departureDate = getRandomDate();
  const routePointType = getRandomArrayElement(POINT_TYPES);

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT),
    dateFrom: departureDate,
    dateTo: getRandomDate(departureDate),
    destination: generateRandomDestination(),
    isFavorite: Boolean(getRandomNumber(0, RANDOM_NUMBER_MIN_LIMIT)),
    offers: getRandomOffersByType(routePointType, offersByTypes)[0].offers,
    type: routePointType
  };
}

function getRandomOffersByType(type, offersByTypes) {
  const typeOffers = offersByTypes.filter((obj) => obj.type === type);
  const offersCount = Math.floor(Math.random() * typeOffers.length + 1);

  return Array.from({length: offersCount}, () => (getRandomArrayElement(typeOffers)));
}


export {generateRoutePoint};
