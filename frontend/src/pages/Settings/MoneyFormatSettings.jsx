import useLanguage from '@/locale/useLanguage';

import MoneyFormatSettingsModule from '@/modules/SettingModule/MoneyFormatSettingsModule';

export default function MoneyFormatSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    SETTINGS_TITLE: translate('Money Format Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'money_format_settings',
    ...Labels,
  };
  return <MoneyFormatSettingsModule config={configPage} />;
}
