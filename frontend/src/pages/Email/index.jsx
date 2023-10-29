import React from 'react';
import useLanguage from '@/lang/useLanguage';
import EmailDataTableModule from '@/modules/EmailModule/EmailDataTableModule';

export default function AdvancedSettings() {
  const entity = 'email';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: 'Template Name',
      dataIndex: 'emailName',
    },
    {
      title: 'Subject',
      dataIndex: 'emailSubject',
    },
    {
      title: 'Body',
      dataIndex: 'emailBody',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Template Name',
      dataIndex: 'emailName',
      key: 'emailName',
    },
    {
      title: 'Subject',
      dataIndex: 'emailSubject',
      key: 'emailSubject',
    },
  ];

  const translate = useLanguage();

  const Labels = {
    PANEL_TITLE: translate('email_template'),
    DATATABLE_TITLE: translate('email_template_list'),
    ADD_NEW_ENTITY: translate('add_new_email_template'),
    ENTITY_NAME: translate('email_template'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    create: false,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <EmailDataTableModule config={config} />;
}
