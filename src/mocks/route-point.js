import {POINT_TYPES, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomArrayElement, getRandomNumber, getRandomDate, getTypeOffers} from '../utils';
import {getOffersByTypes} from './offers';

function generateRoutePoint(destinations) {
  const departureDate = getRandomDate();
  const routePointType = getRandomArrayElement(POINT_TYPES);

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT),
    dateFrom: departureDate,
    dateTo: getRandomDate(departureDate),
    destination: getRandomArrayElement(destinations).id,
    isFavorite: Boolean(getRandomNumber(0, RANDOM_NUMBER_MIN_LIMIT)),
    offers: getRandomOffersByType(routePointType, getOffersByTypes()),
    type: routePointType
  };
}

function getRandomOffersByType(type, offersByTypes) {
  let typeOffers = getTypeOffers(type, offersByTypes);
  const offersCount = Math.floor(Math.random() * typeOffers.length);

  return Array.from({length: offersCount}, () => {
    const offer = getRandomArrayElement(typeOffers);
    typeOffers = typeOffers.filter((current) => current !== offer);
    return offer.id;
  });
}

export {generateRoutePoint};
