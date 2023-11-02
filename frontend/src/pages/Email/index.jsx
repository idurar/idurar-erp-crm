import React from 'react';
import useLanguage from '@/locale/useLanguage';
import EmailDataTableModule from '@/modules/EmailModule/EmailDataTableModule';

export default function AdvancedSettings() {
  const translate = useLanguage();
  const entity = 'email';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const entityDisplayLabels = ['name'];

  const readColumns = [
    {
      title: translate('Template'),
      dataIndex: 'emailName',
    },
    {
      title: translate('Subject'),
      dataIndex: 'emailSubject',
    },
    {
      title: translate('email content'),
      dataIndex: 'emailBody',
    },
  ];
  const dataTableColumns = [
    {
      title: translate('Template'),
      dataIndex: 'emailName',
      key: 'emailName',
    },
    {
      title: translate('Subject'),
      dataIndex: 'emailSubject',
      key: 'emailSubject',
    },
  ];

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
