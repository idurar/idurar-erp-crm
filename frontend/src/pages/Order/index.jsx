import React from 'react';

import CrudModule from '@/modules/CrudModule';
import OrderForm from '@/forms/OrderForm'; // Ensure to create this form
import useLanguage from '@/lang/useLanguage';

export default function Order() {
  const entity = 'order';
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

  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('order'),
    DATATABLE_TITLE: getLang('order_list'),
    ADD_NEW_ENTITY: getLang('add_new_order'),
    ENTITY_NAME: getLang('order'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    readColumns,
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
