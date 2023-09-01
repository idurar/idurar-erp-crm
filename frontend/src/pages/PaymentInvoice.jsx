import React from 'react';

import dayjs from 'dayjs';
import PaymentModule from '@/modules/PaymentModule';

export default function PaymentInvoice() {
  const entity = 'paymentInvoice';
  const searchConfig = {
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['number'];
  const dataTableColumns = [
    {

      title: 'Number',

      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Invoice Number',
      dataIndex: ['invoice', 'number'],
    },
    {
      title: 'Invoice year',
      dataIndex: ['invoice', 'year'],
    },
    {
      title: 'Payment Mode',
      dataIndex: ['paymentMode', 'name'],
    },
  ];

  const ADD_NEW_ENTITY = 'Add new payment';
  const DATATABLE_TITLE = 'Payments List';
  const ENTITY_NAME = 'payment';
  const CREATE_ENTITY = 'Create payment';
  const UPDATE_ENTITY = 'Update payment';
  const PANEL_TITLE = 'payment';

  const config = {
    entity,
    PANEL_TITLE,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <PaymentModule config={config} />;
}
