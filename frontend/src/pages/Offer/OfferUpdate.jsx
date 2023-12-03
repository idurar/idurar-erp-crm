import useLanguage from '@/locale/useLanguage';
import UpdateOfferModule from '@/modules/OfferModule/UpdateOfferModule';

export default function OfferUpdate() {
  const translate = useLanguage();

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: translate('offer'),
    DATATABLE_TITLE: translate('offer_list'),
    ADD_NEW_ENTITY: translate('add_new_offer'),
    ENTITY_NAME: translate('offer'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdateOfferModule config={configPage} />;
}
