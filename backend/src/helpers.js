/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
import fs from 'fs';
import currency from 'currency.js';
// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
import moment from 'moment';

// Making a static map is really long - this is a handy helper function to make one

// inserting an SVG
export const icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};

export const image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

// Some details about the site
export const siteName = `Express.js / MongoBD / Rest Api`;

export const timeRange = (start, end, format, interval) => {
  format = format || 'HH:mm';
  interval = interval || 60;
  interval = interval > 0 ? interval : 60;

  const range = [];
  while (moment(start).isBefore(moment(end))) {
    range.push(moment(start).format(format));
    start = moment(start).add(interval, 'minutes');
  }
  return range;
};

export const calculate = {
  add: (firstValue, secondValue) => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue, secondValue) => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue, secondValue) => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue, secondValue) => {
    return currency(firstValue).divide(secondValue).value;
  },
};
