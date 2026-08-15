import { ErpLayout } from '@/layout';
import CrudModule from '@/modules/CrudModule/CrudModule';
import AdminForm from '@/forms/AdminForm';

import useLanguage from '@/locale/useLanguage';

export default function Admin() {
  const translate = useLanguage();
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'name,surname,email',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name', 'surname', 'email'];

  const dataTableColumns = [
    {
      title: translate('name'),
      dataIndex: 'name',
    },
    {
      title: translate('surname'),
      dataIndex: 'surname',
    },
    {
      title: translate('email'),
      dataIndex: 'email',
    },
    {
      title: translate('role'),
      dataIndex: 'role',
    },
    {
      title: translate('enabled'),
      dataIndex: 'enabled',
      render: (enabled) => (enabled ? translate('Yes') : translate('No')),
    },
  ];

  const readColumns = [
    {
      title: translate('name'),
      dataIndex: 'name',
    },
    {
      title: translate('surname'),
      dataIndex: 'surname',
    },
    {
      title: translate('email'),
      dataIndex: 'email',
    },
    {
      title: translate('role'),
      dataIndex: 'role',
    },
    {
      title: translate('enabled'),
      dataIndex: 'enabled',
      render: (enabled) => (enabled ? translate('Yes') : translate('No')),
    },
  ];

  const config = {
    entity,
    PANEL_TITLE: translate('admin'),
    DATATABLE_TITLE: translate('admin_list'),
    ADD_NEW_ENTITY: translate('add_new_admin'),
    ENTITY_NAME: translate('admin'),
    dataTableColumns,
    readColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <ErpLayout>
      <CrudModule config={config} createForm={<AdminForm />} updateForm={<AdminForm isUpdateForm={true} />} />
    </ErpLayout>
  );
}
