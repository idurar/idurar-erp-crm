import lang from '@/lang/language';

const entity = 'lead';

const Labels = {
  PANEL_TITLE: lang.lead,
  DATATABLE_TITLE: lang.lead_list,
  ADD_NEW_ENTITY: lang.add_new_lead,
  ENTITY_NAME: lang.lead,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
