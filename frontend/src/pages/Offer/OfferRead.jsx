import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import ReadOfferModule from '@/modules/OfferModule/ReadOfferModule';

export default function OfferRead() {
  const lang = useSelector(selectCurrentLang);

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
  return <ReadOfferModule config={configPage} />;
}
