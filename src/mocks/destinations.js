import {CITIES, DESCRIPTION, PHOTO_ADDRESS, RANDOM_NUMBER_MAX_LIMIT, RANDOM_NUMBER_MIN_LIMIT} from '../const';
import {getRandomNumber} from '../utils';

function generateRandomDestination(destinationName) {
  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: destinationName,
    pictures: Array.from({length: Math.floor(Math.random() * 5)}, () => ({
      src: PHOTO_ADDRESS + getRandomNumber(RANDOM_NUMBER_MIN_LIMIT, RANDOM_NUMBER_MAX_LIMIT),
      description: DESCRIPTION
    }))
  };
}

function generateRandomDestinationList() {
  return CITIES.map((destinationName) => generateRandomDestination(destinationName));
}

export {generateRandomDestinationList};
