import {CITIES, DESCRIPTION, PHOTO_ADDRESS, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomArrayElement , getRandomNumber} from '../utils';

function generateRandomDestination() {
  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: getRandomArrayElement(CITIES),
    pictures: Array.from({length: Math.floor(Math.random() * 5 + 1)}, () => ({
      src: PHOTO_ADDRESS + getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT),
      description: DESCRIPTION
    }))
  };
}

export {generateRandomDestination};
