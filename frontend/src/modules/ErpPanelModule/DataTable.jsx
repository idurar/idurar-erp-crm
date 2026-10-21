import { useCallback, useEffect, useState } from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Empty, Modal } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { useNavigate } from 'react-router-dom';

import { request } from '@/request';
import { enhanceTableColumns } from '@/utils/tableColumns';

function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const { DATATABLE_TITLE, EMPTY_TEXT } = config;
  const [tableResetKey, setTableResetKey] = useState(0);
  const [hasTableFilters, setHasTableFilters] = useState(false);
  const [entityFilter, setEntityFilter] = useState(undefined);

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const exportCsv = async () => {
    const response = await request.listAll({
      entity,
      options:
        entityFilter && searchConfig?.entity
          ? { filter: searchConfig.entity, equal: entityFilter }
          : {},
    });
    const exportData = response?.result || [];
    if (!exportData.length) return;
    const columns = dataTableColumns.filter((column) => column.dataIndex);
    const valueAt = (row, key) => {
      const path = Array.isArray(key) ? key : [key];
      return path.reduce((value, part) => value?.[part], row) ?? '';
    };
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      columns.map((column) => escape(column.title)).join(';'),
      ...exportData.map((row) =>
        columns.map((column) => escape(valueAt(row, column.dataIndex))).join(';')
      ),
    ];
    const blob = new Blob([`\uFEFF${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entity}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  const itemsForRecord = (record) => [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
      disabled:
        entity === 'invoice' &&
        (record.issuedAt ||
          record.paymentStatus === 'paid' ||
          ['cancelled', 'refunded'].includes(record.status)),
    },
    {
      label:
        entity === 'invoice' && !record.issuedAt
          ? 'Veröffentlichen & PDF'
          : translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
    ...extra.map((item) => ({
      ...item,
      label: typeof item.label === 'function' ? item.label(record) : item.label,
      disabled: item.disabled?.(record) || false,
    })),
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
      disabled: entity === 'invoice' && (record.status !== 'draft' || Number(record.credit) > 0),
    },
  ];

  const navigate = useNavigate();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: 'update', data }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const downloadDocument = (record) =>
    request.download({
      path: `download/${entity}/${entity}-${record._id}.pdf`,
      filename: `${entity}-${record.number || record._id}.pdf`,
    });

  const handleDownload = (record) => {
    if (entity !== 'invoice' || record.issuedAt) return downloadDocument(record);

    return Modal.confirm({
      title: `Rechnung ${record.number ? `${record.number}/${record.year || ''}` : 'Entwurf'} veröffentlichen und PDF herunterladen?`,
      content:
        'Danach ist die Rechnung nicht mehr bearbeitbar und enthaltene Lagerartikel werden ausgebucht.',
      okText: 'Veröffentlichen & PDF',
      cancelText: 'Abbrechen',
      onOk: async () => {
        const response = await request.patch({
          entity: `invoice/issue/${record._id}`,
          jsonData: {},
        });
        if (!response?.success) {
          throw new Error(response?.message || 'Rechnung konnte nicht veröffentlicht werden');
        }
        await downloadDocument(response.result || record);
        dispatcher();
      },
    });
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleRecordPayment = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record._id}`);
  };

  dataTableColumns = [
    ...enhanceTableColumns(dataTableColumns),
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: itemsForRecord(record),
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'recordPayment':
                  handleRecordPayment(record);
                  break;
                default:
                  extra.find((item) => item.key === key)?.onClick?.(record, dispatcher);
                  break;
              }
              // else if (key === '2')handleCloseTask
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

  const dispatch = useDispatch();

  const handelDataTableLoad = (pagination, filters, sorter, extra) => {
    setHasTableFilters(
      Object.values(filters || {}).some((value) => value?.length) || Boolean(sorter?.order)
    );
    if (extra?.action && extra.action !== 'paginate') return;
    const activeFilter = Object.entries(filters || {}).find(([, value]) => value?.length);
    const sortField = Array.isArray(sorter?.field) ? sorter.field.join('.') : sorter?.field;
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
      ...(activeFilter && { filter: activeFilter[0], equal: activeFilter[1][0] }),
      ...(sortField && { sortBy: sortField, sortValue: sorter.order === 'ascend' ? 1 : -1 }),
      ...(entityFilter &&
        searchConfig?.entity && {
          filter: searchConfig.entity,
          equal: entityFilter,
        }),
    };
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = useCallback(() => {
    dispatch(erp.list({ entity }));
  }, [dispatch, entity]);

  useEffect(() => {
    dispatcher();
  }, [dispatcher]);

  const filterTable = (value) => {
    setEntityFilter(value);
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erp.list({ entity, options }));
  };

  const clearAllFilters = () => {
    setEntityFilter(undefined);
    setHasTableFilters(false);
    setTableResetKey((key) => key + 1);
    dispatcher();
  };

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <AutoCompleteAsync
            key={`search-auto-complete-${tableResetKey}`}
            entity={searchConfig?.entity}
            displayLabels={['name']}
            searchFields={'name'}
            onChange={filterTable}
            placeholder={`${DATATABLE_TITLE} durchsuchen …`}
            // redirectLabel={'Add New Client'}
            // withRedirect
            // urlToRedirect={'/customer'}
          />,
          <Button onClick={handelDataTableLoad} key="refresh-button" icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,
          <Button
            onClick={exportCsv}
            key="export-button"
            icon={<DownloadOutlined />}
            disabled={!pagination?.count}
          >
            CSV Export
          </Button>,

          !disableAdd && <AddNewItem config={config} key="add-new-item" />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      {(hasTableFilters || entityFilter) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <Button type="text" danger icon={<CloseOutlined />} onClick={clearAllFilters}>
            Alle Filter löschen
          </Button>
        </div>
      )}

      <Table
        key={`table-${tableResetKey}`}
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
        locale={{
          emptyText: (
            <Empty
              description={EMPTY_TEXT || `Noch keine Einträge in „${DATATABLE_TITLE}“ vorhanden`}
            >
              {!disableAdd && <AddNewItem config={config} />}
            </Empty>
          ),
        }}
      />
    </>
  );
}
