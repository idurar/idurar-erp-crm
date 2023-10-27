import React from 'react';

import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
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
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      render: (date) => {
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
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

  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.employee,
    DATATABLE_TITLE: lang.employee_list,
    ADD_NEW_ENTITY: lang.add_new_employee,
    ENTITY_NAME: lang.employee,
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
      createForm={<EmployeeForm />}
      updateForm={<EmployeeForm isUpdateForm={true} />}
      config={config}
    />
  );
}
