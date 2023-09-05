/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

const currency = require('currency.js');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one

// inserting an SVG
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};
exports.image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

// Some details about the site
exports.siteName = `Express.js / MongoBD / Rest Api`;

exports.timeRange = (start, end, format, interval) => {
  if (format == undefined) {
    format = 'HH:mm';
  }

  if (interval == undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;

  const range = [];
  while (moment(start).isBefore(moment(end))) {
    range.push(moment(start).format(format));
    start = moment(start).add(interval, 'minutes');
  }
  return range;
};

exports.calculate = {
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
