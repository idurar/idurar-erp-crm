import CrudModule from '@/modules/CrudModule/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';
import useLanguage from '@/locale/useLanguage';

export default function PaymentMode() {
  const translate = useLanguage();
  const config = {
    entity: 'paymentmode',
    PANEL_TITLE: translate('payment_mode'),
    DATATABLE_TITLE: translate('payment_mode_list'),
    ADD_NEW_ENTITY: translate('add_new_payment_mode'),
    ENTITY_NAME: translate('payment_mode'),
    fields: {
      name: { type: 'string', label: 'name' },
      enabled: { type: 'boolean', label: 'enabled' },
    },
    searchConfig: {
      displayLabels: ['name'],
      searchFields: 'name',
    },
    deleteModalLabels: ['name'],
  };

  return (
    <CrudModule
      createForm={<PaymentModeForm />}
      updateForm={<PaymentModeForm isUpdateForm />}
      config={config}
    />
  );
}
