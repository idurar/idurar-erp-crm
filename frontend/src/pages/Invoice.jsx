import React from 'react';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import InvoiceModule from '@/modules/InvoiceModule';
import { useMoney } from '@/settings';

export default function Invoice() {
  const { moneyRowFormatter } = useMoney();

  const entity = 'invoice';
  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,birthday',
  };
  const entityDisplayLabels = ['number', 'client.company'];
  const dataTableColumns = [
    {
      title: '#N',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Due date',
      dataIndex: 'expiredDate',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (amount) => moneyRowFormatter({ amount }),
    },
    {
      title: 'Balance',
      dataIndex: 'credit',
      render: (amount) => moneyRowFormatter({ amount }),
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'draft' ? 'cyan' : status === 'sent' ? 'magenta' : 'gold';

        return <Tag color={color}>{status && status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let color =
          paymentStatus === 'unpaid'
            ? 'volcano'
            : paymentStatus === 'paid'
            ? 'green'
            : paymentStatus === 'overdue'
            ? 'red'
            : 'purple';

        return <Tag color={color}>{paymentStatus && paymentStatus.toUpperCase()}</Tag>;
      },
    },
  ];

  const PANEL_TITLE = 'invoice';
  const dataTableTitle = 'invoices Lists';
  const ADD_NEW_ENTITY = 'Add new invoice';
  const DATATABLE_TITLE = 'invoices List';
  const ENTITY_NAME = 'invoice';
  const CREATE_ENTITY = 'Save invoice';
  const UPDATE_ENTITY = 'Update invoice';

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
  return <InvoiceModule config={config} />;
}
