import React from 'react';

import useLanguage from '@/lang/useLanguage';

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
      render: (text, row) => {
        return `${text}`;
      },
    },
    {
      title: 'enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      onCell: (record, rowIndex) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
        };
      },
      render: (_, record) => {
        return (
          <Switch
            disabled={record.isCoreSetting}
            checked={record.enabled}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
  ];

  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('settings'),
    DATATABLE_TITLE: getLang('settings_list'),
    ADD_NEW_ENTITY: getLang('add_new_settings'),
    ENTITY_NAME: getLang('setting'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
    RECORD_ENTITY: getLang('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
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
