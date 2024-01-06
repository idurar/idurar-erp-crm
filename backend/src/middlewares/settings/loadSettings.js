import listAllSettings from './listAllSettings';

const loadSettings = async () => {
  const allSettings = {};
  const datas = await listAllSettings();
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });
  return allSettings;
};

export default loadSettings;
