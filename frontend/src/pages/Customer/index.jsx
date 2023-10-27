import React from 'react';

import CrudModule from '@/modules/CrudModule';
import CustomerForm from '@/forms/CustomerForm';

import configPage from './config';

function Customer() {
  const searchConfig = {
    displayLabels: ['company'],
    searchFields: 'company,managerSurname,managerName',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['company'];

  const readColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Manager Surname',
      dataIndex: 'managerSurname',
    },
    {
      title: 'Manager Name',
      dataIndex: 'managerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Manager Surname',
      dataIndex: 'managerSurname',
    },
    {
      title: 'Manager Name',
      dataIndex: 'managerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };

  return (
    <CrudModule
      createForm={<CustomerForm />}
      updateForm={<CustomerForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default Customer;
