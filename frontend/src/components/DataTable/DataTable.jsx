import { useCallback, useEffect } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import { Dropdown, Table, Button, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { useCrudContext } from '@/context/crud';
import { exportCSV } from '@/utils/exportCSV';

/* -------------------- ADD NEW ITEM -------------------- */
function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handleClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handleClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

/* -------------------- MAIN TABLE -------------------- */
export default function DataTable({ config, extra = [] }) {
  const { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;

  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;

  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

  const dispatch = useDispatch();

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  /* -------------------- ACTION MENU -------------------- */
  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },
    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  /* -------------------- ACTION HANDLERS -------------------- */
  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };

  const handleEdit = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  };

  const handleDelete = (record) => {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleUpdatePassword = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  };

  /* -------------------- TABLE DATA -------------------- */
  let dispatchColumns = fields
    ? dataForTable({ fields, translate, moneyFormatter, dateFormat })
    : dataTableColumns;

  dispatchColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              if (key === 'read') handleRead(record);
              if (key === 'edit') handleEdit(record);
              if (key === 'delete') handleDelete(record);
              if (key === 'updatePassword') handleUpdatePassword(record);
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  /* -------------------- DATA FETCH -------------------- */
  const loadTable = useCallback(
    (pagination) => {
      const options = {
        page: pagination?.current || 1,
        items: pagination?.pageSize || 10,
      };

      dispatch(crud.list({ entity, options }));
    },
    [dispatch, entity]
  );

  const filterTable = (e) => {
    const value = e.target.value;

    dispatch(
      crud.list({
        entity,
        options: {
          q: value,
          fields: searchConfig?.searchFields || '',
        },
      })
    );
  };

  const dispatcher = useCallback(() => {
    dispatch(crud.list({ entity }));
  }, [dispatch, entity]);

  useEffect(() => {
    dispatcher();
  }, [dispatcher]);

  /* -------------------- CSV EXPORT -------------------- */
  const handleExportCSV = () => {
    if (!dataSource?.length) return;
    exportCSV(dataSource, `${entity}.csv`);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key="search"
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
          />,

          <Button
            key="refresh"
            onClick={loadTable}
            icon={<RedoOutlined />}
          >
            Refresh
          </Button>,

          <Button
            key="export"
            onClick={handleExportCSV}
            icon={<DownloadOutlined />}
          >
            Export CSV
          </Button>,

          <AddNewItem key="add" config={config} />,
        ]}
      />

      <Table
        columns={dispatchColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={loadTable}
        scroll={{ x: true }}
      />
    </>
  );
}