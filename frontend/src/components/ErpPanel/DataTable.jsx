import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Descriptions, Dropdown, Table } from 'antd';
import { Button, PageHeader } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';

import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import axios from 'axios';

function AddNewItem({ config }) {
  const { entity, ADD_NEW_ENTITY } = config;
  const { erpContextAction } = useErpContext();
  const dispatch = useDispatch();
  const { createPanel } = erpContextAction;

  const handelClick = async () => {
    //Todo: set this code in its own hook
    async function fetchDataForAllPages() {
      const results = [];

      const firstPageResponse = await axios.get('/invoice/list');
      const firstPageData = firstPageResponse.data;

      if (firstPageData.success) {
        results.push(...firstPageData.result);

        const totalPages = firstPageData.pagination.pages;

        for (let page = 2; page <= totalPages; page++) {
          try {
            const nextPageResponse = await axios.get(`/invoice/list?page=${page}`);
            const nextPageData = nextPageResponse.data;

            if (nextPageData.success) {
              results.push(...nextPageData.result);
            } else {
              console.error(`Error fetching data for page ${page}`);
            }
          } catch (error) {
            console.error(`Error fetching data for page ${page}:`, error);
          }
        }
      } else {
        console.error('Error fetching data for the first page');
      }
      return results;
    }

    fetchDataForAllPages()
      .then((results) => {
        results.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

        const formattedInvoicesArray = results.map((invoice, index) => {
          const dateNum = invoice.number.split('/');
          const date = dateNum[0];
          const num = dateNum[1];

          let formattedNumber;
          if (index < 100) {
            formattedNumber = (+num + 1).toString().padStart(3, '0');
            return `${date}/${formattedNumber}`;
          }
          if (index < 1000) {
            formattedNumber = (+num + 1).toString().padStart(2, '0');

            return `${date}/${formattedNumber}`;
          } else {
            formattedNumber = (+num + 1).toString();
            return `${date}/${formattedNumber}`;
          }
        });
        const formattedInvoices = formattedInvoicesArray[0];
        dispatch(erp.invoiceFollowNum({ date: formattedInvoices }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    createPanel.open();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, DataTableDropMenu }) {
  let { entity, dataTableColumns } = config;
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
    const options = { page: pagination.current || 1 };
    dispatch(erp.list({ entity, options }));
  }, []);

  useEffect(() => {
    dispatch(erp.list({ entity }));
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
            <AddNewItem config={config} key={`${uniqueId()}`} />,
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
