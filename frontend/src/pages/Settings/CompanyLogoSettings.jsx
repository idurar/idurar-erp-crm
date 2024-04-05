import useLanguage from '@/locale/useLanguage';

import CompanyLogoSettingsModule from '@/modules/SettingModule/CompanyLogoSettingsModule';

export default function AppSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),

    SETTINGS_TITLE: translate('General Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };

  return <CompanyLogoSettingsModule config={configPage} />;
}
