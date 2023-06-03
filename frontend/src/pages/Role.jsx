import React from 'react';

import CrudModule from '@/modules/CrudModule';
import RoleForm from '@/forms/ٌRoleForm';

export default function Role() {
  const entity = 'role';
  const searchConfig = {
    displayLabels: ['displayName'],
    searchFields: 'codeName,displayName',
    outputValue: '_id',
  };

  const PANEL_TITLE = 'Role Panel';
  const dataTableTitle = 'Role Lists';
  const entityDisplayLabels = ['displayName'];

  const readColumns = [
    { title: 'codeName', dataIndex: 'codeName' },
    { title: 'displayName', dataIndex: 'displayName' },
    { title: 'dashboardType', dataIndex: 'dashboardType' },
  ];

  const dataTableColumns = [
    { title: 'codeName', dataIndex: 'codeName' },
    { title: 'displayName', dataIndex: 'displayName' },
    { title: 'dashboardType', dataIndex: 'dashboardType' },
  ];
  const ADD_NEW_ENTITY = 'Add new Role';
  const DATATABLE_TITLE = 'Roles List';
  const ENTITY_NAME = 'Role';
  const CREATE_ENTITY = 'Create Role';
  const UPDATE_ENTITY = 'Update Role';

  const config = {
    entity,
    PANEL_TITLE,
    dataTableTitle,
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
      createForm={<RoleForm />}
      updateForm={<RoleForm isUpdateForm={true} />}
      config={config}
    />
  );
}
