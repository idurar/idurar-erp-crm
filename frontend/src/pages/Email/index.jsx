import React from 'react';
import useLanguage from '@/lang/useLanguage';
import CrudModule from '@/modules/CrudModule';
import AdvancedSettingsForm from '@/forms/AdvancedSettingsForm';
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

  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('email_template'),
    DATATABLE_TITLE: getLang('email_template_list'),
    ADD_NEW_ENTITY: getLang('add_new_email_template'),
    ENTITY_NAME: getLang('email_template'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
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
