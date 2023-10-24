import React from 'react';
import CrudModule from '@/modules/CrudModule';
import InventoryForm from '@/forms/InventoryForm'; // Retaining InventoryForm
import configPage from './config';

export default function Inventory() {
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

  const config = {
    ...configPage,
    readColumns,
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
