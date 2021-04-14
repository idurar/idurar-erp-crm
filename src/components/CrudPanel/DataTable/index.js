import React, { useCallback, useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { listAction } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";

const dropDownRowMenu = (currentRow) => {
  function Show() {
    console.log(currentRow._id);
  }
  function Edit() {
    console.log(currentRow._id);
  }
  function Delete() {
    console.log(currentRow._id);
  }
  return (
    <Menu style={{ width: 130 }}>
      <Menu.Item icon={<EyeOutlined />} onClick={Show}>
        Show
      </Menu.Item>
      <Menu.Item icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} onClick={Delete}>
        Delete
      </Menu.Item>
    </Menu>
  );
};

export default function DataTable({ entity, columns }) {
  columns = [
    ...columns,
    {
      title: "",
      render: (row) => (
        <Dropdown overlay={dropDownRowMenu(row)} trigger={["click"]}>
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];

  const {
    result: listResult,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useSelector(selectListItems);

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(listAction(entity, pagination.current));
  }, []);

  useEffect(() => {
    handelDataTableLoad(pagination);
  }, []);

  return (
    <Table
      columns={columns}
      rowKey={(item) => item._id}
      dataSource={items}
      pagination={pagination}
      loading={listIsLoading}
      onChange={handelDataTableLoad}
    />
  );
}
