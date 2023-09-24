import configPage from './config';

import GeneralSettingsModule from '@/modules/SettingModule/GeneralSettingsModule';

const config = {
  ...configPage,
  //customConfig,
};
export default function GeneralSettings() {
  return <GeneralSettingsModule config={config} />;
}
