import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

import AppSettingsModule from '@/modules/SettingModule/AppSettingsModule';

export default function AppSettings() {
  const lang = useSelector(selectCurrentLang);

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: lang.settings,
    DATATABLE_TITLE: lang.settings_list,
    ADD_NEW_ENTITY: lang.add_new_settings,
    ENTITY_NAME: lang.settings,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
    SETTINGS_TITLE: 'General Settings',
  };

  const configPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };

  return <AppSettingsModule config={configPage} />;
}
