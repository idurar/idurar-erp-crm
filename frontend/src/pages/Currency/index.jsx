import React from 'react';

import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

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

  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.currency,
    DATATABLE_TITLE: lang.currency_list,
    ADD_NEW_ENTITY: lang.add_new_currency,
    ENTITY_NAME: lang.currency,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
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
