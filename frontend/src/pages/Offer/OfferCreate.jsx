import useLanguage from '@/locale/useLanguage';
import CreateOfferModule from '@/modules/OfferModule/CreateOfferModule';

export default function OfferCreate() {
  const translate = useLanguage();

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: translate('offer'),
    DATATABLE_TITLE: translate('offer_list'),
    ADD_NEW_ENTITY: translate('add_new_offer'),
    ENTITY_NAME: translate('offer'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateOfferModule config={configPage} />;
}
