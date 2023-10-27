import dayjs from 'dayjs';
import { Tag } from 'antd';
import React from 'react';

import CrudModule from '@/modules/CrudModule';
import LeadForm from '@/forms/LeadForm';

import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

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

  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.lead,
    DATATABLE_TITLE: lang.lead_list,
    ADD_NEW_ENTITY: lang.add_new_lead,
    ENTITY_NAME: lang.lead,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
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
