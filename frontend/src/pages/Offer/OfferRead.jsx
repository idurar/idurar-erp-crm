import useLanguage from '@/lang/useLanguage';
import ReadOfferModule from '@/modules/OfferModule/ReadOfferModule';

export default function OfferRead() {
  const getLang = useLanguage();

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: getLang('offer'),
    DATATABLE_TITLE: getLang('offer_list'),
    ADD_NEW_ENTITY: getLang('add_new_offer'),
    ENTITY_NAME: getLang('offer'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadOfferModule config={configPage} />;
}
