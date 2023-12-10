import React from 'react';

import useLanguage from '@/locale/useLanguage';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import CurrencyForm from '@/forms/CurrencyForm';

export default function Currency() {
  const translate = useLanguage();
  const entity = 'currency';

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: translate('Currency'),
      dataIndex: 'name',
    },
    {
      title: translate('Currency'),
      dataIndex: 'symbol',
    },
    {
      title: translate('Decimal Separator'),
      dataIndex: 'decimal_separator',
    },
    {
      title: translate('Thousand Separator'),
      dataIndex: 'thousand_separator',
    },
    {
      title: translate('Default'),
      dataIndex: 'isDefault',
    },
  ];
  const dataTableColumns = [
    {
      title: translate('Currency'),
      dataIndex: 'name',
    },
    {
      title: translate('Currency'),
      dataIndex: 'symbol',
    },
    {
      title: translate('Decimal Separator'),
      dataIndex: 'decimal_separator',
    },
    {
      title: translate('Thousand Separator'),
      dataIndex: 'thousand_separator',
    },
    {
      title: translate('Default'),
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

  const Labels = {
    PANEL_TITLE: translate('currency'),
    DATATABLE_TITLE: translate('currency_list'),
    ADD_NEW_ENTITY: translate('add_new_currency'),
    ENTITY_NAME: translate('currency'),
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
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<CurrencyForm />}
      updateForm={<CurrencyForm isUpdateForm={true} />}
      config={config}
    />
  );
}
