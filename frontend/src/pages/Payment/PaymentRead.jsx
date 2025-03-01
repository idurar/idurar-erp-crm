import useLanguage from '@/locale/useLanguage';
import ReadPaymentModule from '@/modules/PaymentModule/ReadPaymentModule';

export default function PaymentRead() {
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
  return <ReadPaymentModule config={configPage} />;
}
