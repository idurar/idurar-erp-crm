import React from 'react';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule';
import CurrencyForm from '@/forms/CurrencyForm';

export default function Currency() {
  const entity = 'currency';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Currency Name',
      dataIndex: 'name',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
    },
    {
      title: 'Decimal Sep',
      dataIndex: 'decimalSeparator',
    },
    {
      title: 'Thousand Sep',
      dataIndex: 'thousandSeparator',
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Currency Name',
      dataIndex: 'name',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
    },
    {
      title: 'Decimal Sep',
      dataIndex: 'decimalSeparator',
    },
    {
      title: 'Thousand Sep',
      dataIndex: 'thousandSeparator',
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (text, row) => {
        return {
          props: {
            style: {
              width: '60px',
            },
          },
          children: (
            <Switch
              checked={text}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          ),
        };
      },
    },
  ];

  const ADD_NEW_ENTITY = 'Add new currency';
  const DATATABLE_TITLE = 'currencys List';
  const ENTITY_NAME = 'currency';
  const CREATE_ENTITY = 'Create currency';
  const UPDATE_ENTITY = 'Update currency';
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
      createForm={<CurrencyForm />}
      updateForm={<CurrencyForm isUpdateForm={true} />}
      config={config}
    />
  );
}
