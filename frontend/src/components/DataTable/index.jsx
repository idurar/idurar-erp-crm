import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Button, PageHeader, Table, Col, Descriptions } from 'antd';

import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';

import uniqueId from '@/utils/uinqueId';
import useResponsiveTable from '@/hooks/useResponsiveTable';

import useReactQuery from '@/hooks/useReactRouter/useReactQuery';
import { useQueryClient } from '@tanstack/react-query';

import { request } from '@/request';

export default function DataTable({ config, DropDownRowMenu, AddNewItem }) {
  let { entity, dataTableColumns, DATATABLE_TITLE } = config;
  const queryClient = useQueryClient();
  const dispatch = useDispatch()
  const [options,setOptions] = useState({'page':1});
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

  const { result:data, isLoading: listIsLoading } = useReactQuery(
    [entity,'list',options],
    () => request.list({ entity, options }),
    {
      staleTime:120000
    }
  );
  const listResult = {
  items: data&&data.result?data.result:[],
  pagination: {
    current: data?parseInt(data.pagination.page, 10):0,
    pageSize: 10,
    total: data?parseInt(data.pagination.count, 10):0,
  },
  }
  const { pagination, items } = listResult;

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1 };
    setOptions(options);
  }, []);

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  useEffect(() => {
    dispatch(crud.list({entity,options,resData:data}));
  },[data])

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
