import {OFFERS, POINT_TYPES, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomArrayElement , getRandomNumber} from '../utils';

const LIMIT = 5;
const OFFERS_BY_TYPE = generateOffersByTypes();

function generateRandomOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT)
  };
}

function getOffersByTypes() {
  return OFFERS_BY_TYPE;
}

function generateOffersByTypes() {
  const offersCount = Math.floor(Math.random() * LIMIT + 1);
  return POINT_TYPES.map((type) => ({
    type,
    offers: Array.from({length: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, offersCount)}, () => (generateRandomOffer()))
  }));
}

export {generateRandomOffer, getOffersByTypes};
