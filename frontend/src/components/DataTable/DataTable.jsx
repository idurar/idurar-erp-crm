import { useCallback, useEffect, useState } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input, Empty } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';
import { enhanceTableColumns } from '@/utils/tableColumns';

import { useCrudContext } from '@/context/crud';

function ResizableHeaderCell({ onColumnResize, children, ...restProps }) {
  const startResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = event.currentTarget.parentElement.getBoundingClientRect().width;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const resize = (moveEvent) => onColumnResize(Math.max(80, startWidth + moveEvent.clientX - startX));
    const stopResize = () => {
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener('pointermove', resize);
      window.removeEventListener('pointerup', stopResize);
    };
    window.addEventListener('pointermove', resize);
    window.addEventListener('pointerup', stopResize);
  };

  return (
    <th {...restProps} style={{ ...restProps.style, position: 'relative' }}>
      {children}
      {onColumnResize && (
        <span
          aria-hidden="true"
          onPointerDown={startResize}
          style={{ position: 'absolute', top: 0, right: -4, zIndex: 2, width: 8, height: '100%', cursor: 'col-resize', touchAction: 'none' }}
        />
      )}
    </th>
  );
}

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig, SEARCH_PLACEHOLDER, EMPTY_TEXT } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();
  const [tableResetKey, setTableResetKey] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [hasTableFilters, setHasTableFilters] = useState(false);
  const [columnWidths, setColumnWidths] = useState({});

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
      hidden: () => config.allowEdit === false,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
      hidden: () => config.allowDelete === false,
    },
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  let dispatchColumns = [];
  if (dataTableColumns) {
    dispatchColumns = [...dataTableColumns];
  } else if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  }

  dataTableColumns = [
    ...enhanceTableColumns(dispatchColumns),
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: items.filter((item) => !item?.hidden?.(record)),
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  items.find((item) => item?.key === key)?.onClick?.(record, dispatcher);
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
  dataTableColumns = dataTableColumns.map((column, index) => {
    if (column.key === 'action') return column;
    const columnKey = String(column.key || (Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex) || index);
    const width = columnWidths[columnKey] || column.width;
    return {
      ...column,
      width,
      onHeaderCell: () => ({
        width,
        onColumnResize: (nextWidth) => setColumnWidths((current) => ({ ...current, [columnKey]: nextWidth })),
      }),
    };
  });

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination, filters, sorter, extra) => {
    setHasTableFilters(
      Object.values(filters || {}).some((value) => value?.length) || Boolean(sorter?.order)
    );
    if (extra?.action && extra.action !== 'paginate') return;
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, [dispatch, entity]);

  const filterTable = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = useCallback(() => {
    dispatch(crud.list({ entity }));
  }, [dispatch, entity]);

  const clearAllFilters = () => {
    setSearchValue('');
    setHasTableFilters(false);
    setTableResetKey((key) => key + 1);
    dispatcher();
  };

  useEffect(() => {
    dispatcher();
  }, [dispatcher]);

  return (
    <>
      <PageHeader
        onBack={config.hideBackButton ? undefined : () => window.history.back()}
        backIcon={config.hideBackButton ? false : <ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            value={searchValue}
            placeholder={SEARCH_PLACEHOLDER || translate('search')}
            allowClear
          />,
          !config.hideRefreshButton && <Button onClick={handelDataTableLoad} key="refresh" icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,

          <AddNewItem key="add" config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      {(hasTableFilters || searchValue) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <Button type="text" danger icon={<CloseOutlined />} onClick={clearAllFilters}>
            Alle Filter löschen
          </Button>
        </div>
      )}

      <Table
        key={tableResetKey}
        components={{ header: { cell: ResizableHeaderCell } }}
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: (
            <Empty description={EMPTY_TEXT || `Noch keine Einträge in „${DATATABLE_TITLE}“ vorhanden`}>
              <AddNewItem config={config} />
            </Empty>
          ),
        }}
      />
    </>
  );
}
