import React from 'react';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule';
import AdvancedSettingsForm from '@/forms/AdvancedSettingsForm';

export default function AdvancedSettings() {
  const entity = 'email';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Template Name',
      dataIndex: 'emailName',
    },
    {
      title: 'Subject',
      dataIndex: 'emailSubject',
    },
    {
      title: 'Body',
      dataIndex: 'emailBody',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Template Name',
      dataIndex: 'emailName',
    },
    {
      title: 'Subject',
      dataIndex: 'emailSubject',
      key: 'emailSubject',
      render: (text, row) => {
        return {
          children: <span>{text}</span>,
        };
      },
    },
  ];

  const ADD_NEW_ENTITY = 'Add new Setting';
  const DATATABLE_TITLE = 'Email Templates';
  const ENTITY_NAME = 'template settings';
  const CREATE_ENTITY = 'Create a setting';
  const UPDATE_ENTITY = 'Update a Template';
  const PANEL_TITLE = 'Email Template Panel';

  const config = {
    entity,
    PANEL_TITLE,
    ENTITY_NAME,
    CREATE_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<AdvancedSettingsForm />}
      updateForm={<AdvancedSettingsForm isUpdateForm={true} />}
      config={config}
    />
  );
}
