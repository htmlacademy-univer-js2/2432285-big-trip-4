import {POINT_TYPES, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const'
import {getRandomArrayElement, getRandomNumber, getRandomDate} from '../utils'
import {generateRandomDestination} from './destinations';
import {generateRandomOffer} from './offers';

const LIMIT = 5;

function generateRoutePoint() {
  const offersCount = Math.floor(Math.random() * LIMIT + 1);
  const departureDate = getRandomDate();

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT),
    dateFrom: departureDate,
    dateTo: getRandomDate(departureDate),
    destination: generateRandomDestination(),
    isFavorite: Boolean(getRandomNumber(0, RANDOM_NUMBER_MIN_LIMIT)),
    offers: Array.from({length: offersCount}, () => (generateRandomOffer())),
    type: getRandomArrayElement(POINT_TYPES)
  };
}


export {generateRoutePoint}
