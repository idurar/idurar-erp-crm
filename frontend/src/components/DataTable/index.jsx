import React, { useCallback, useEffect } from 'react';
import { Dropdown, Button, PageHeader, Table, Col, Descriptions } from 'antd';

import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';

import uniqueId from '@/utils/uinqueId';
import useResponsiveTable from '@/hooks/useResponsiveTable';

export default function DataTable({ config, DropDownRowMenu, AddNewItem }) {
  let { entity, dataTableColumns, DATATABLE_TITLE } = config;
  // console.log('entity from components->dataTable', entity);
  // console.log('config from components->dataTable', config);
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      render: (row) => (
        <Dropdown overlay={DropDownRowMenu({ row })} trigger={['click']}>
          <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '24px' }} />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  useEffect(() => {
    dispatch(crud.list({ entity }));
  }, []);

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  return (
    <>
      <div ref={tableHeader}>
        <PageHeader
          onBack={() => window.history.back()}
          title={DATATABLE_TITLE}
          ghost={false}
          extra={[
            <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
              Refresh
            </Button>,
            <AddNewItem key={`${uniqueId()}`} config={config} />,
          ]}
          style={{
            padding: '20px 0px',
          }}
        ></PageHeader>
      </div>
      <Table
        columns={tableColumns}
        rowKey={(item) => item._id}
        dataSource={items}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        expandable={
          expandedRowData.length
            ? {
                expandedRowRender: (record) => (
                  <Descriptions title="" bordered column={1}>
                    {expandedRowData.map((item, index) => {
                      return (
                        <Descriptions.Item key={index} label={item.title}>
                          {item.render?.(record[item.dataIndex])?.children
                            ? item.render?.(record[item.dataIndex])?.children
                            : item.render?.(record[item.dataIndex])
                            ? item.render?.(record[item.dataIndex])
                            : Array.isArray(item.dataIndex)
                            ? record[item.dataIndex[0]]?.[item.dataIndex[1]]
                            : record[item.dataIndex]}
                        </Descriptions.Item>
                      );
                    })}
                  </Descriptions>
                ),
              }
            : null
        }
      />
    </>
  );
}
