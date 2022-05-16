import React from 'react';

import CrudModule from '@/modules/CrudModule';
import EmployeeForm from '@/forms/EmployeeForm';
import dayjs from 'dayjs';
export default function Employee() {
  const entity = 'employee';
  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,birthday',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name', 'surname'];

  const dataTableColumns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
    },
    {
      title: 'birthday',
      dataIndex: 'birthday',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'department',
      dataIndex: 'department',
    },
    {
      title: 'position',
      dataIndex: 'position',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
  ];

  const readColumns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
    },
    {
      title: 'birthday',
      dataIndex: 'birthday',
      isDate: true,
    },
    {
      title: 'birthplace',
      dataIndex: 'birthplace',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
    },
    {
      title: 'department',
      dataIndex: 'department',
    },
    {
      title: 'position',
      dataIndex: 'position',
    },
    {
      title: 'address',
      dataIndex: 'address',
    },
    {
      title: 'state',
      dataIndex: 'state',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
  ];

  const ADD_NEW_ENTITY = 'Add new employee';
  const DATATABLE_TITLE = 'employees List';
  const ENTITY_NAME = 'employee';
  const CREATE_ENTITY = 'Create employee';
  const UPDATE_ENTITY = 'Update employee';
  const PANEL_TITLE = 'Employee Panel';

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
      createForm={<EmployeeForm />}
      updateForm={<EmployeeForm isUpdateForm={true} />}
      config={config}
    />
  );
}
