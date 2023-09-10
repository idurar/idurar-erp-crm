import React from 'react';
import { Dropdown, Menu, Table } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { erp } from '@/redux/erp/actions';
import { useErpContext } from '@/context/erp';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

function DropDownRowMenu({ row, entity }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;
  const Show = () => {
    history.push(`/${entity}/read/${row._id}`);
  };
  function Edit() {
    history.push(`/${entity}/update/${row._id}`);
  }
  function Delete() {
    dispatch(erp.currentAction({ actionType: 'delete', data: {...row,entity }}));
    modal.open();
  }
  function Download() {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${row._id}`, '_blank');
  }

  return (
    <Menu style={{ width: 130 }}>
      <Menu.Item key={"recent-table-show"} icon={<EyeOutlined />} onClick={Show}>
        Show
      </Menu.Item>
      <Menu.Item key={"recent-table-edit"} icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
      <Menu.Item key={"recent-table-delete"} icon={<DeleteOutlined />} onClick={Delete}>
        Delete
      </Menu.Item>
      <Menu.Item onClick={Download} icon={<FilePdfOutlined />}>
        Download
      </Menu.Item>
    </Menu>
  );
}

export default function RecentTable({ ...props }) {
  
  let { entity, dataTableColumns, data } = props;
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      render: (row) => (
        <Dropdown overlay={DropDownRowMenu({ row, entity })} trigger={['click']}>
          <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '24px' }} />
        </Dropdown>
      ),
    },
  ];

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList,data);
  const firstFiveItems = () => {
    if (isSuccess && result) return result.slice(0, 5);
    return [];
  };
  return (
    <>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={isSuccess && firstFiveItems()}
        pagination={false}
        loading={isLoading}
      />
    </>
  );
}
