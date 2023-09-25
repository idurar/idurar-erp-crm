import React, { useCallback, useEffect, useEffectLayout, useRef, useState } from 'react';
import { Descriptions, Dropdown, Table } from 'antd';
import { Button, PageHeader } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';
import { useHistory } from 'react-router-dom';

import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import useResponsiveTable from '@/hooks/useResponsiveTable';
function AddNewItem({ config }) {
  const history = useHistory();
  const { ADD_NEW_ENTITY, entity } = config;
  const { erpContextAction } = useErpContext();
  const { createPanel } = erpContextAction;
  const handelClick = () => {
    // createPanel.open();
    history.push(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, DataTableDropMenu }) {
  let { entity, dataTableColumns, create = true } = config;
  const { DATATABLE_TITLE } = config;
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      render: (row) => (
        <Dropdown overlay={DataTableDropMenu({ row, entity })} trigger={['click']}>
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
    dispatch(erp.list({ entity, options }));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(erp.list({ entity }));

    return () => {
      controller.abort();
    };
  }, []);

  const { expandedRowData, tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  return (
    <>
      <div ref={tableHeader}>
        <PageHeader
          title={DATATABLE_TITLE}
          ghost={true}
          extra={[
            <Button onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<RedoOutlined />}>
              Refresh
            </Button>,
            create ? <AddNewItem config={config} key={`${uniqueId()}`} /> : <></>,
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
