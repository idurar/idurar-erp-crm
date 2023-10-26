import configPage from './config';

import AppSettingsModule from '@/modules/SettingModule/AppSettingsModule';

const config = {
  ...configPage,
  settingsCategory: 'app_settings',
  SETTINGS_TITLE: 'General Settings',
};
export default function AppSettings() {
  return <AppSettingsModule config={config} />;
}
