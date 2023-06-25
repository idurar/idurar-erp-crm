import React from 'react';
import CrudModule from '@/modules/CrudModule';
import PaymentInvoiceForm from '@/forms/PaymentInvoiceForm';

import dayjs from 'dayjs';

export default function PaymentInvoice() {
  const entity = 'paymentInvoice';
  const searchConfig = {
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['number'];

  const readColumns = [
    {
      title: 'number',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: 'client.company',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      isDate: true,
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoice.number',
    },
    {
      title: 'Invoice year',
      dataIndex: 'invoice.year',
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode.name',
    },
    {
      title: 'updated ',
      dataIndex: 'updated',
      isDate: true,
    },
    {
      title: 'created ',
      dataIndex: 'created',
      isDate: true,
    },
  ];
  const dataTableColumns = [
    {
      title: 'number',
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
  const DATATABLE_TITLE = 'payments List';
  const ENTITY_NAME = 'payment';
  const CREATE_ENTITY = 'Create payment';
  const UPDATE_ENTITY = 'Update payment';
  const PANEL_TITLE = 'Currency Panel';

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
      createForm={<PaymentInvoiceForm />}
      updateForm={<PaymentInvoiceForm isUpdateForm={true} />}
      config={config}
    />
  );
}
