import React, { useCallback, useEffect, useRef } from 'react';
import { Descriptions, Dropdown, Table } from 'antd';
import { Button, PageHeader } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { settings } from '@/redux/settings/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import uniqueId from '@/utils/uinqueId';

import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
function AddNewItem({ config }) {
  const { ADD_NEW_ENTITY } = config;
  const { erpContextAction } = useErpContext();
  const { createPanel } = erpContextAction;
  const handelClick = () => {
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

  // const handelCurrency = () => {
  //   dispatch(settings.currency({ value: '€' }));
  //   dispatch(settings.currencyPosition({ position: 'before' }));
  // };
  const tableHeader = useRef(null);
  useEffect(() => {
    dispatch(erp.list({ entity }));
  }, []);
  // useEffect(() => {
  //   const header = tableHeader.current;
  //   if (!header) return;
  //   const observer = new ResizeObserver(() => {
  //     // 👉 Do something when the element is resized
  //     checkTableWidth(header);
  //   });

  //   observer.observe(header);
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  const checkTableWidth = (header) => {
    const tableWidth = document.querySelector('.ant-table-thead').offsetWidth;
    if (tableWidth > header.clientWidth) {
      shrinkTable();
    }
    if (tableWidth < header.clientWidth) {
      console.log('expandTable');
    }
  };

  const shrinkTable = () => {
    const element = dataTableColumns.pop();
    console.log(element, dataTableColumns);
  };
  const expandedRowData = [
    { Product: 'Cloud Database' },
    { Billing: 'Prepaid' },
    { time: '18:00:00' },
    { Amount: '$80.00' },
    { Discount: '$20.00' },
    { Official: '$60.00' },
  ];
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
            // <Button onClick={handelCurrency} key={`${uniqueId()}`} icon={<RedoOutlined />}>
            //   Change Currency
            // </Button>,
            <AddNewItem config={config} key={`${uniqueId()}`} />,
          ]}
          style={{
            padding: '20px 0px',
          }}
        ></PageHeader>
      </div>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={items}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        expandable={{
          expandedRowRender: () => (
            <Descriptions title="" bordered column={1}>
              {expandedRowData.map((item, index) => {
                return (
                  <Descriptions.Item key={index} label={Object.keys(item)[0]}>
                    {Object.values(item)[0]}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          ),
        }}
      />
    </>
  );
}
