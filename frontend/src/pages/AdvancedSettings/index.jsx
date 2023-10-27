import React from 'react';

import configPage from './config';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule';
import AdvancedSettingsForm from '@/forms/AdvancedSettingsForm';

export default function AdvancedSettings() {
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
      render: (text, row) => {
        return `${text}`;
      },
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

  const config = {
    ...configPage,
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
