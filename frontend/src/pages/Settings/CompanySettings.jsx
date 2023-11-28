import useLanguage from '@/locale/useLanguage';

import CompanySettingsModule from '@/modules/SettingModule/CompanySettingsModule';

export default function CompanySettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),

    SETTINGS_TITLE: translate('Company Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'company_settings',
    ...Labels,
  };
  return <CompanySettingsModule config={configPage} />;
}
