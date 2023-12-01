import useLanguage from '@/locale/useLanguage';

import FinanceSettingsModule from '@/modules/SettingModule/FinanceSettingsModule';

export default function FinanceSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),

    SETTINGS_TITLE: translate('Finance Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'finance_settings',
    ...Labels,
  };
  return <FinanceSettingsModule config={configPage} />;
}
