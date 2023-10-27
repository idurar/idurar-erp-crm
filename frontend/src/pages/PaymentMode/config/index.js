import lang from '@/lang/language';

const entity = 'paymentMode';

const Labels = {
  PANEL_TITLE: lang.payment_mode,
  DATATABLE_TITLE: lang.payment_mode_list,
  ADD_NEW_ENTITY: lang.add_new_payment_mode,
  ENTITY_NAME: lang.payment_mode,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
