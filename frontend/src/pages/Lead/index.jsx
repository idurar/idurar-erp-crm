import dayjs from 'dayjs';
import { Tag } from 'antd';
import React from 'react';

import CrudModule from '@/modules/CrudModule';
import LeadForm from '@/forms/LeadForm';

import useLanguage from '@/lang/useLanguage';

export default function Lead() {
  const entity = 'lead';
  const searchConfig = {
    displayLabels: ['firstname', 'company'],
    searchFields: 'firstname,company',
    outputValue: '_id',
  };
  const entityDisplayLabels = ['number', 'company'];

  const readColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },

    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

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
    },
  ];

  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('lead'),
    DATATABLE_TITLE: getLang('lead_list'),
    ADD_NEW_ENTITY: getLang('add_new_lead'),
    ENTITY_NAME: getLang('lead'),
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
      createForm={<LeadForm />}
      updateForm={<LeadForm isUpdateForm={true} />}
      config={config}
    />
  );
}
