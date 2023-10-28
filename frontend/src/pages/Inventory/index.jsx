import React from 'react';
import CrudModule from '@/modules/CrudModule';
import InventoryForm from '@/forms/InventoryForm'; // Retaining InventoryForm
import useLanguage from '@/lang/useLanguage';

export default function Inventory() {
  const entity = 'inventory'; // Updated entity name
  const searchConfig = {
    displayLabels: ['product'], // Adjusted to search by product
    searchFields: 'product',
    outputValue: '_id',
  };
  const entityDisplayLabels = ['product', 'quantity', 'unitPrice']; // Adjusted to display inventory item labels

  const readColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
    },
  ];

  const dataTableColumns = [
    {
      title: 'Product',
      dataIndex: ['product'],
    },
    {
      title: 'Quantity',
      dataIndex: ['quantity'],
    },
    {
      title: 'Unit Price in $',
      dataIndex: ['unitPrice'],
    },
  ];

  const translate = useLanguage();

  const Labels = {
    PANEL_TITLE: translate('product'),
    DATATABLE_TITLE: translate('product_list'),
    ADD_NEW_ENTITY: translate('add_new_product'),
    ENTITY_NAME: translate('product'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<InventoryForm />} // Retaining InventoryForm
      updateForm={<InventoryForm isUpdateForm={true} />} // Retaining InventoryForm
      config={config}
    />
  );
}
