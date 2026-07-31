import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', {month: 'short'}).toUpperCase();
  return `${day} ${month}`;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return !dayjs().isBefore(point.dateFrom) && !dayjs().isAfter(point.dateTo);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  getRandomArrayElement,
  formatDate,
  isPointFuture,
  isPointPresent,
  isPointPast,
  updateItem,
  sortByDay,
  sortByTime,
  sortByPrice,
};
