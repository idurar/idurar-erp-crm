import React from 'react';
import CrudModule from '@/modules/CrudModule/CrudModule';
import InventoryForm from '@/forms/InventoryForm'; // Retaining InventoryForm
import useLanguage from '@/locale/useLanguage';

export default function Inventory() {
  const translate = useLanguage();
  const entity = 'inventory'; // Updated entity name
  const searchConfig = {
    displayLabels: ['product'], // Adjusted to search by product
    searchFields: 'product',
    outputValue: '_id',
  };
  const deleteModalLabels = ['product', 'quantity', 'unitPrice']; // Adjusted to display inventory item labels

  const readColumns = [
    {
      title: translate('Product'),
      dataIndex: 'product',
    },
    {
      title: translate('Quantity'),
      dataIndex: 'quantity',
    },
    {
      title: translate('Unit Price'),
      dataIndex: 'unitPrice',
    },
  ];

  const dataTableColumns = [
    {
      title: translate('Product'),
      dataIndex: ['product'],
    },
    {
      title: translate('Quantity'),
      dataIndex: ['quantity'],
    },
    {
      title: translate('Unit Price'),
      dataIndex: ['unitPrice'],
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('product'),
    DATATABLE_TITLE: translate('product_list'),
    ADD_NEW_ENTITY: translate('add_new_product'),
    ENTITY_NAME: translate('product'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<InventoryForm />} // Retaining InventoryForm
      updateForm={<InventoryForm isUpdateForm={true} />} // Retaining InventoryForm
      config={config}
    />
  );
}
