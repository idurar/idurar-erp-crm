import React from 'react';
import { Button } from 'antd';

import CrudModule from '@/modules/CrudModule';
import KycForm from '@/forms/KycForm'; // Ensure to create this form
import { BASE_URL } from '@/config/serverApiConfig';

function Kyc() {
  const entity = 'kyc'; // Keeping entity value as 'order'
  const searchConfig = {
    displayLabels: ['name', 'contact'],
    searchFields: 'name,contact',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
    },
    {
      title: 'File',
      dataIndex: 'filePath',
      render: (filePath) => {
        return (
          <Button type="link" onClick={() => window.open(`${BASE_URL}${filePath}`, '_blank')}>
            Download File
          </Button>
        );
      },
    },
  ];

  const ADD_NEW_ENTITY = 'Add new KYC entry';
  const DATATABLE_TITLE = 'KYC List';
  const ENTITY_NAME = 'KYC entry';
  const CREATE_ENTITY = 'Create KYC entry';
  const UPDATE_ENTITY = 'Update KYC entry';
  const PANEL_TITLE = 'KYC Panel';

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
      createForm={<KycForm />}
      updateForm={<KycForm isUpdateForm={true} />}
      config={config}
      withUpload={true}
    />
  );
}

export default Kyc;
