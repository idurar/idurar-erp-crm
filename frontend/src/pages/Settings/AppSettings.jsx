import useLanguage from '@/lang/useLanguage';

import AppSettingsModule from '@/modules/SettingModule/AppSettingsModule';

export default function AppSettings() {
  const getLang = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: getLang('settings'),
    DATATABLE_TITLE: getLang('settings_list'),
    ADD_NEW_ENTITY: getLang('add_new_settings'),
    ENTITY_NAME: getLang('settings'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
    SETTINGS_TITLE: 'General Settings',
  };

  const configPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };

  return <AppSettingsModule config={configPage} />;
}
