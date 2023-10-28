import useLanguage from '@/lang/useLanguage';

import GeneralSettingsModule from '@/modules/SettingModule/GeneralSettingsModule';

export default function GeneralSettings() {
  const getLang = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: getLang('settings'),
    DATATABLE_TITLE: getLang('settings_list'),
    ADD_NEW_ENTITY: getLang('add_new_settings'),
    ENTITY_NAME: getLang('settings'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
    SETTINGS_TITLE: 'Money Format Settings',
  };

  const configPage = {
    entity,
    settingsCategory: 'finance_settings',
    ...Labels,
  };
  return <GeneralSettingsModule config={configPage} />;
}
