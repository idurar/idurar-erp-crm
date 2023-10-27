import React from 'react';

import CrudModule from '@/modules/CrudModule';
import OrderForm from '@/forms/OrderForm'; // Ensure to create this form
import configPage from './config';

function Order() {
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

  const config = {
    ...configPage,
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
