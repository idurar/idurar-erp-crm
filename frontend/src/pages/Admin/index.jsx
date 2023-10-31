import React from 'react';

import useLanguage from '@/locale/useLanguage';
import AdminCrudModule from '@/modules/AdminCrudModule';
import AdminForm from '@/forms/AdminForm';

export default function Admin() {
  const translate = useLanguage();
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'email,name,surname',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['email'];

  const readColumns = [
    { title: translate('first name'), dataIndex: 'name' },
    { title: translate('last name'), dataIndex: 'surname' },
    { title: translate('Email'), dataIndex: 'email' },
    { title: translate('role'), dataIndex: 'role' },
  ];

  const dataTableColumns = [
    { title: translate('first name'), dataIndex: 'name' },
    { title: translate('last name'), dataIndex: 'surname' },
    { title: translate('Email'), dataIndex: 'email' },
    { title: translate('role'), dataIndex: 'role' },
  ];

  const Labels = {
    PANEL_TITLE: translate('admin'),
    DATATABLE_TITLE: translate('admin_list'),
    ADD_NEW_ENTITY: translate('add_new_admin'),
    ENTITY_NAME: translate('admin'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
    RECORD_ENTITY: translate('record_payment'),
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
    <AdminCrudModule
      createForm={<AdminForm />}
      updateForm={<AdminForm isUpdateForm={true} />}
      config={config}
    />
  );
}
