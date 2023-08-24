/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');
const mongoose = require('mongoose');

const getData = require('./controllers/corsControllers/custom').getData;

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

exports.adminPhotoUrl = (admin) => {
  if (admin) {
    return admin.photo ? '/' + admin.photo : '/images/photos/profile.jpg';
  } else {
    return '/images/photos/profile.jpg';
  }
};

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

exports.settingCommercial = async (name) => {
  try {
    const Model = mongoose.model('SettingCommercial');
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log('setting fetch failed', err);
  }
};

exports.settingGlobal = async (name) => {
  try {
    const Model = mongoose.model('SettingGlobal');
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log('setting fetch failed', err);
  }
};

exports.settingMedical = async (name) => {
  try {
    const Model = mongoose.model('SettingMedical');
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log('setting fetch failed', err);
  }
};

// const settingCommercial = () => {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			resolve(getData('SettingCommercial'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

// const settingGlobal = () => {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			resolve(getData('SettingGlobal'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

// const settingMedical = () => {
// 	return new Promise( (resolve, reject) => {
// 		try {
// 			resolve(getData('SettingMedical'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

/**
 * Medical` settings
 */
// module.exports.settings = async (callback) => {
// 	var settings = {}

// 	await settingCommercial().then(function (data) {
// 		settings['commercial'] = data;
// 	});

// 	await settingGlobal().then(function (data) {
// 		settings['global'] = data;
// 	});

// 	await settingMedical().then(function (data) {
// 		settings['medical'] = data;
// 	});

// 	callback(settings);
// }
