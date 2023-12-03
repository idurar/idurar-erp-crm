import useLanguage from '@/locale/useLanguage';

import GeneralSettingsModule from '@/modules/SettingModule/GeneralSettingsModule';

export default function GeneralSettings() {
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
  return <GeneralSettingsModule config={configPage} />;
}
