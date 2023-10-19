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
import axios from 'axios';

function AddNewItem({ config }) {
  const history = useHistory();
  const { ADD_NEW_ENTITY, entity } = config;
  const { erpContextAction } = useErpContext();
  const { createPanel } = erpContextAction;
  const dispatch = useDispatch();

  const handelClick = () => {
    //TODO: set this code in its own hook
    //TODO: replace axios with request from request.js
    const fetchDataForInvoiceFollowNum = async () => {
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
    };

    fetchDataForInvoiceFollowNum()
      .then((results) => {
        results.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

        const formattedInvoicesArray = results.map((invoice, i) => {
          const date = new Date();
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const dateNum = invoice.number.split('/');
          const num = dateNum[1];

          console.log(num);
          const index = 101;

          let formattedNumber;
          if (index < 100) {
            formattedNumber = (+num + 1).toString().padStart(3, '0');
            return `${year + month}/${formattedNumber}`;
          }
          if (index < 1000) {
            formattedNumber = (+num + 1).toString().padStart(2, '0');
            return `${year + month}/${formattedNumber}`;
          } else {
            formattedNumber = (+num + 1).toString();
            return `${year + month}/${formattedNumber}`;
          }
        });

        const formattedInvoices = formattedInvoicesArray[0];
        dispatch(erp.invoiceFollowNum({ date: formattedInvoices }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
