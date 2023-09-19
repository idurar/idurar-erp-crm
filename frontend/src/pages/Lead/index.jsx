import dayjs from 'dayjs';
import { Tag } from 'antd';

import LeadDataTableModule from '@/modules/LeadModule/LeadDataTableModule';

import configPage from './config';

export default function Lead() {
  const searchConfig = {
    displayLabels: ['firstname', 'company'],
    searchFields: 'firstname,company',
  };
  const entityDisplayLabels = ['number', 'company'];
  const dataTableColumns = [
    {
      title: 'First Name',
      dataIndex: ['firstName'],
    },

    {
      title: 'Last Name',
      dataIndex: ['lastName'],
    },
    {
      title: 'Company',
      dataIndex: ['company'],
    },
    {
      title: 'Email',
      dataIndex: ['email'],
    },
    {
      title: 'Phone',
      dataIndex: ['phone'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color =
          status === 'new'
            ? 'cyan'
            : status === 'reached'
            ? 'blue'
            : status === 'interested'
            ? 'green'
            : status === 'not interested'
            ? 'orange'
            : 'red';
        return <Tag color={color}>{status && status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    }
  ];

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <LeadDataTableModule config={config} />;
}
