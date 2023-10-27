import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

import MoneyFormatSettingsModule from '@/modules/SettingModule/MoneyFormatSettingsModule';

export default function MoneyFormatSettings() {
  const lang = useSelector(selectCurrentLang);

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: lang.settings,
    DATATABLE_TITLE: lang.settings_list,
    ADD_NEW_ENTITY: lang.add_new_settings,
    ENTITY_NAME: lang.settings,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
    SETTINGS_TITLE: 'Money Format Settings',
  };

  const configPage = {
    entity,
    settingsCategory: 'money_format_settings',
    ...Labels,
  };
  return <MoneyFormatSettingsModule config={configPage} />;
}
