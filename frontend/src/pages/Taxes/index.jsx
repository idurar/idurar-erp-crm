import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';
import useLanguage from '@/locale/useLanguage';

export default function Taxes() {
  const translate = useLanguage();
  const config = {
    entity: 'taxes',
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('tax'),
    fields: {
      taxName: { type: 'string', label: 'tax_name' },
      taxValue: { type: 'string', label: 'tax_value' },
      enabled: { type: 'boolean', label: 'enabled' },
      isDefault: { type: 'boolean', label: 'Default' },
    },
    searchConfig: {
      displayLabels: ['taxName'],
      searchFields: 'taxName',
    },
    deleteModalLabels: ['taxName'],
  };

  return (
    <CrudModule
      createForm={<TaxForm />}
      updateForm={<TaxForm isUpdateForm />}
      config={config}
    />
  );
}
