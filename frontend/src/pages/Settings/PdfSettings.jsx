import useLanguage from '@/locale/useLanguage';

import PdfSettingsModule from '@/modules/SettingModule/PdfSettingsModule';

export default function PdfSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    SETTINGS_TITLE: translate('PDF Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'pdf_settings',
    ...Labels,
  };
  return <PdfSettingsModule config={configPage} />;
}
