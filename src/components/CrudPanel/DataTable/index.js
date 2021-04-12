import React from "react";
import { Dropdown, Menu, Table } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectListItems } from "@/redux/crud/selectors";

export default function DataTable({ entity, columns, handleTableChange }) {
  const dropDownRowMenu = (currentRow) => {
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

  let {
    result: listResult,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useSelector(selectListItems);

  return (
    <Table
      columns={columns}
      rowKey={(record) => record._id}
      dataSource={listResult.items}
      pagination={listResult.pagination}
      loading={listIsLoading}
      onChange={handleTableChange}
    />
  );
}
