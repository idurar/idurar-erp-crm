const listBySettingKey = require('./listBySettingKey');
const readBySettingKey = require('./readBySettingKey');
const listAllSettings = require('./listAllSettings');
const updateBySettingKey = require('./updateBySettingKey');
const increaseBySettingKey = require('./increaseBySettingKey');
const loadSettings = require('./loadSettings');

module.exports = {
  loadSettings,
  listAllSettings,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  increaseBySettingKey,
};
