import useLanguage from '@/lang/useLanguage';

import MoneyFormatSettingsModule from '@/modules/SettingModule/MoneyFormatSettingsModule';

export default function MoneyFormatSettings() {
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
    settingsCategory: 'money_format_settings',
    ...Labels,
  };
  return <MoneyFormatSettingsModule config={configPage} />;
}
