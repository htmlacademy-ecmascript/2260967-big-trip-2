import {getRandomArrayElement} from '../utils.js';
import dayjs from 'dayjs';

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const PRICES = [50, 75, 90, 100, 120, 150, 200, 250, 300];

const DESTINATIONS = [
  {
    id: 'destination-1',
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Amsterdam'
      }
    ]
  },
  {
    id: 'destination-2',
    name: 'Geneva',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=2',
        description: 'Geneva'
      }
    ]
  },
  {
    id: 'destination-3',
    name: 'Chamonix',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Chamonix'
      }
    ]
  }
];

const OFFERS = [
  {
    id: 'offer-1',
    type: 'flight',
    title: 'Add luggage',
    price: 30
  },
  {
    id: 'offer-2',
    type: 'flight',
    title: 'Switch to comfort class',
    price: 100
  },
  {
    id: 'offer-3',
    type: 'taxi',
    title: 'Upgrade to a business class',
    price: 120
  },
  {
    id: 'offer-4',
    type: 'restaurant',
    title: 'Choose live music',
    price: 25
  }
];

function generateRandomDateFrom() {
  const daysGap = Math.floor(Math.random() * 10);
  const hoursGap = Math.floor(Math.random() * 24);

  return dayjs()
    .add(daysGap, 'day')
    .hour(hoursGap)
    .minute(0)
    .second(0)
    .toISOString();
}

function generatePoint() {
  const type = getRandomArrayElement(TYPES);
  const destination = getRandomArrayElement(DESTINATIONS);

  const availableOffers = OFFERS.filter((offer) => offer.type === type);

  const dateFrom = generateRandomDateFrom();
  const durationHours = Math.floor(Math.random() * 5) + 1;
  const dateTo = dayjs(dateFrom).add(durationHours, 'hour').toISOString();

  return {
    id: String(Math.random()),
    type,
    destination: destination.id,
    dateFrom,
    dateTo,
    basePrice: getRandomArrayElement(PRICES),
    offers: availableOffers.length
      ? [getRandomArrayElement(availableOffers).id]
      : [],
    isFavorite: false
  };
}

export {TYPES, DESTINATIONS, OFFERS, generatePoint};
