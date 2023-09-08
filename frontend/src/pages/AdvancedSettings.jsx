import React from 'react';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule';
import AdvancedSettingsForm from '@/forms/AdvancedSettingsForm';

export default function AdvancedSettings() {
  const entity = 'setting';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Setting Name',
      dataIndex: 'settingKey',
    },
    {
      title: 'Value',
      dataIndex: 'settingValue',
    },
    {
      title: 'enabled',
      dataIndex: 'enabled',
    },
    {
      title: 'Core Setting',
      dataIndex: 'isCoreSetting',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Setting Name',
      dataIndex: 'settingKey',
    },
    {
      title: 'Value',
      dataIndex: 'settingValue',
    },
    {
      title: 'enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (text, row) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
          children: (
            <Switch
              disabled={row.isCoreSetting}
              checked={row.enabled}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          ),
        };
      },
    },
  ];

  const ADD_NEW_ENTITY = 'Add new Setting';
  const DATATABLE_TITLE = 'Settings List';
  const ENTITY_NAME = 'advanced settings';
  const CREATE_ENTITY = 'Create a setting';
  const UPDATE_ENTITY = 'Update a setting';
  const PANEL_TITLE = 'Settings Panel';

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
      createForm={<AdvancedSettingsForm />}
      updateForm={<AdvancedSettingsForm isUpdateForm={true} />}
      config={config}
    />
  );
}
