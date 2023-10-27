import React from 'react';
import CrudModule from '@/modules/CrudModule';
import InventoryForm from '@/forms/InventoryForm'; // Retaining InventoryForm
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

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

  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.product,
    DATATABLE_TITLE: lang.product_list,
    ADD_NEW_ENTITY: lang.add_new_product,
    ENTITY_NAME: lang.product,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
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
