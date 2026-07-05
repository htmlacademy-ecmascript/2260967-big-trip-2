import {getRandomArrayElement} from '../utils.js';

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

function generatePoint() {
  const type = getRandomArrayElement(TYPES);
  const destination = getRandomArrayElement(DESTINATIONS);

  const availableOffers = OFFERS.filter((offer) => offer.type === type);

  return {
    id: String(Math.random()),
    type,
    destination: destination.id,
    dateFrom: '2026-07-10T10:00:00.000Z',
    dateTo: '2026-07-10T14:00:00.000Z',
    basePrice: 250,
    offers: availableOffers.length
      ? [getRandomArrayElement(availableOffers).id]
      : [],
    isFavorite: false
  };
}


export {TYPES, DESTINATIONS, OFFERS,generatePoint};
