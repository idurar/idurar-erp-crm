import CreateOfferModule from '@/modules/OfferModule/CreateOfferModule';
import useLanguage from '@/locale/useLanguage';

export default function OfferCreate() {
  const translate = useLanguage();

  const entity = 'offer';
  const Labels = {
    PANEL_TITLE: translate('Offer Leads'),
    DATATABLE_TITLE: translate('Discounts'),
    ADD_NEW_ENTITY: translate('add_new_offer'),
    ENTITY_NAME: translate('Offer Leads'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateOfferModule config={configPage} />;
}
