import lang from '@/lang/language';

const entity = 'offer';

const Labels = {
  PANEL_TITLE: lang.offer,
  DATATABLE_TITLE: lang.offer_list,
  ADD_NEW_ENTITY: lang.add_new_offer,
  ENTITY_NAME: lang.offer,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
