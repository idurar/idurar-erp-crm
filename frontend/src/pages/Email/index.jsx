import React from 'react';
import useLanguage from '@/locale/useLanguage';
import EmailDataTableModule from '@/modules/EmailModule/EmailDataTableModule';

export default function Email() {
  const translate = useLanguage();
  const entity = 'email';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

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
    deleteModalLabels,
  };
  return <EmailDataTableModule config={config} />;
}
