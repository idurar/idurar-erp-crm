import React from 'react';

import CrudModule from '@/modules/CrudModule';
import OrderForm from '@/forms/OrderForm'; // Ensure to create this form

function Order() {
  const entity = 'order'; // Keeping entity value as 'order'
  const searchConfig = {
    displayLabels: ['orderId', 'status'],
    searchFields: 'orderId,status',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['orderId'];

  const readColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
    },
    {
      title: 'Products',
      dataIndex: 'products',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
    },
    {
      title: 'Products',
      dataIndex: 'products',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },

    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const ADD_NEW_ENTITY = 'Add new shipping entry';
  const DATATABLE_TITLE = 'Shipping List';
  const ENTITY_NAME = 'shipping entry';
  const CREATE_ENTITY = 'Create shipping entry';
  const UPDATE_ENTITY = 'Update shipping entry';
  const PANEL_TITLE = 'Shipping Panel';

  const config = {
    entity,
    PANEL_TITLE,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<OrderForm />}
      updateForm={<OrderForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default Order;
