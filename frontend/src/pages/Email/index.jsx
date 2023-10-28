import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
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

  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.email_template,
    DATATABLE_TITLE: lang.email_template_list,
    ADD_NEW_ENTITY: lang.add_new_email_template,
    ENTITY_NAME: lang.email_template,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
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
