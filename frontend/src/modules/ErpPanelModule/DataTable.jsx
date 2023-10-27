import React, { useCallback, useEffect, useEffectLayout, useRef, useState } from 'react';
import { Descriptions, Dropdown, Table } from 'antd';
import { Button, PageHeader, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';
import { useHistory } from 'react-router-dom';

import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import useResponsiveTable from '@/hooks/useResponsiveTable';

import { selectItemById } from '@/redux/erp/selectors';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

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

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const items = [
    {
      label: '1nd menu item',
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];

  const history = useHistory();

  const handleCreateChildTask = (record) => {
    console.log('record', record);

    console.log('🚀 ~ file: DataTable.jsx:22 ~ Read ~ record:', record);
    const item = dataSource.find((item) => item._id === record._id);
    dispatch(erp.currentItem({ data: item }));

    history.push(`/offer/read/${record._id}`);
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              handleCreateChildTask(record);
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

  const handelDataTableLoad = (pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
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
        dataSource={dataSource}
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
