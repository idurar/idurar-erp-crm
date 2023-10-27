import lang from '@/lang/language';

const entity = 'admin';

const Labels = {
  PANEL_TITLE: lang.admin,
  DATATABLE_TITLE: lang.admin_list,
  ADD_NEW_ENTITY: lang.add_new_admin,
  ENTITY_NAME: lang.admin,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
