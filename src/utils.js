import dayjs from 'dayjs';
import { FilterType, TYPES, DEFAULT_POINT_TYPE } from './const.js';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;
const TIME_PAD_LENGTH = 2;
const TIME_PAD_CHAR = '0';
const LOCALE = 'en-US';
const MONTH_FORMAT = { month: 'short' };

function formatDate(date) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString(LOCALE, MONTH_FORMAT).toUpperCase();
  return `${day} ${month}`;
}

function getSafeType(type) {
  return TYPES.includes(type) ? type : DEFAULT_POINT_TYPE;
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

function getDuration(dateFrom, dateTo) {
  const totalMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(totalMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((totalMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  const paddedMinutes = String(minutes).padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR);

  if (days > 0) {
    const paddedDays = String(days).padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR);
    const paddedHours = String(hours).padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR);
    return `${paddedDays}D ${paddedHours}H ${paddedMinutes}M`;
  }

  if (hours > 0) {
    const paddedHours = String(hours).padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR);
    return `${paddedHours}H ${paddedMinutes}M`;
  }

  return `${paddedMinutes}M`;
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

export {
  formatDate,
  getSafeType,
  updateItem,
  sortByDay,
  sortByTime,
  sortByPrice,
  getDuration,
  isEscapeKey,
  filter,
};
