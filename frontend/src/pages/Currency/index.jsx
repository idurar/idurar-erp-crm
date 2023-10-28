import React from 'react';

import useLanguage from '@/lang/useLanguage';

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
      dataIndex: 'decimal_separator',
    },
    {
      title: 'Thousand Sep',
      dataIndex: 'thousand_separator',
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
      dataIndex: 'decimal_separator',
    },
    {
      title: 'Thousand Sep',
      dataIndex: 'thousand_separator',
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

  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('currency'),
    DATATABLE_TITLE: getLang('currency_list'),
    ADD_NEW_ENTITY: getLang('add_new_currency'),
    ENTITY_NAME: getLang('currency'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
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
      createForm={<CurrencyForm />}
      updateForm={<CurrencyForm isUpdateForm={true} />}
      config={config}
    />
  );
}
