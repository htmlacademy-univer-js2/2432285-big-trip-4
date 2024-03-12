import {OFFERS, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomArrayElement , getRandomNumber} from '../utils';

function generateRandomOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT)
  };
}

export {generateRandomOffer};
