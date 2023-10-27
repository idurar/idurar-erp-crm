import lang from '@/lang/language';

const entity = 'employee';

const Labels = {
  PANEL_TITLE: lang.employee,
  DATATABLE_TITLE: lang.employee_list,
  ADD_NEW_ENTITY: lang.add_new_employee,
  ENTITY_NAME: lang.employee,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
