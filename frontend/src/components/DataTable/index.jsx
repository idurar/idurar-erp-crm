import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Button, PageHeader, Table, Col, Input } from 'antd';

import { EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';

import uniqueId from '@/utils/uinqueId';

export default function DataTable({ config, DropDownRowMenu, AddNewItem }) {
  const [searchInput, setSearchInput] = useState(''); //state for the search input
  let { entity, dataTableColumns, dataTableTitle } = config;

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
    const options = { page: pagination.current || 1, searchFilter: searchInput };
    dispatch(crud.list({ entity, options }));
  }, []);

  // function to handle search
  const onSearchHandler = (value) => {
    setSearchInput(value);
  };
  // function to handle search input change
  const searchChangeHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const options = { searchFilter: searchInput };
    dispatch(crud.list({ entity, options }));
  }, [searchInput]);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={dataTableTitle}
        ghost={false}
        extra={[
          <Input.Search
            placeholder="search..."
            key={`search_input_unique_id`}
            allowClear
            onSearch={onSearchHandler}
            value={searchInput}
            onChange={searchChangeHandler}
            style={{
              width: 250,
            }}
          />,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
            Refresh
          </Button>,
          <AddNewItem key={`${uniqueId()}`} config={config} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={items}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
      />
    </>
  );
}
