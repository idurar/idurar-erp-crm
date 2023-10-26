import dayjs from 'dayjs';
import { Tag } from 'antd';
import configPage from './config';
import { useMoney } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const { moneyRowFormatter } = useMoney();

  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,birthday',
  };
  const entityDisplayLabels = ['number', 'client.company'];
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
      render: (total) => moneyRowFormatter({ amount: total }),
    },
    {
      title: 'Balance',
      dataIndex: 'credit',
      render: (credit) => moneyRowFormatter({ amount: credit }),
    },
    {
      title: 'Status',
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
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'name'],
      // render: (name) => {
      //   console.log('🚀 ~ file: index.jsx:81 ~ Invoice ~ name:', name);
      //   let color = name !== '' ? 'blue' : 'gray';
      //   return <Tag color={color}>{name ? name : 'Administrator'}</Tag>;
      // },
    },
  ];

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <InvoiceDataTableModule config={config} />;
}
