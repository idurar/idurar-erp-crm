import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import UpdatePaymentModule from '@/modules/PaymentModule/UpdatePaymentModule';

export default function PaymentUpdate() {
  const lang = useSelector(selectCurrentLang);

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: lang.payment,
    DATATABLE_TITLE: lang.payment_list,
    ADD_NEW_ENTITY: lang.add_new_payment,
    ENTITY_NAME: lang.payment,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdatePaymentModule config={configPage} />;
}
