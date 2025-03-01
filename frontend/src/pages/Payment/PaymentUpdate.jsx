import useLanguage from '@/locale/useLanguage';
import UpdatePaymentModule from '@/modules/PaymentModule/UpdatePaymentModule';

export default function PaymentUpdate() {
  const translate = useLanguage();

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdatePaymentModule config={configPage} />;
}
