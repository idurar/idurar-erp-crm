import lang from '@/lang/language';

const entity = 'setting';

const Labels = {
  PANEL_TITLE: lang.settings,
  DATATABLE_TITLE: lang.settings_list,
  ADD_NEW_ENTITY: lang.add_new_settings,
  ENTITY_NAME: lang.settings,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
