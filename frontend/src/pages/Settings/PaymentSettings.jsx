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
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
    SETTINGS_TITLE: translate('Money Format Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'finance_settings',
    ...Labels,
  };
  return <GeneralSettingsModule config={configPage} />;
}
