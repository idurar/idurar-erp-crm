import React from 'react';

import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';

export default function PaymentMode() {
  const entity = 'paymentMode';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Payment Mode',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Is Default',
      dataIndex: 'isDefault',
    },
    {
      title: 'enabled',
      dataIndex: 'enabled',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Payment Mode',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Is Default',
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
    {
      title: 'Enabled',
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
    PANEL_TITLE: lang.payment_mode,
    DATATABLE_TITLE: lang.payment_mode_list,
    ADD_NEW_ENTITY: lang.add_new_payment_mode,
    ENTITY_NAME: lang.payment_mode,
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
      createForm={<PaymentModeForm />}
      updateForm={<PaymentModeForm isUpdateForm={true} />}
      config={config}
    />
  );
}
