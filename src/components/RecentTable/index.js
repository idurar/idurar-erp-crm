import React, { useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import { useQuery } from "react-query";
import { request } from "@/request";

import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function DropDownRowMenu({ row }) {
  const Show = () => {};
  function Edit() {}
  function Delete() {}
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
}

export default function RecentTable({ ...props }) {
  let { entity, dataTableColumns } = props;
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: "",
      render: (row) => (
        <Dropdown overlay={DropDownRowMenu({ row })} trigger={["click"]}>
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];

  const { isLoading, error, data } = useQuery(entity, () =>
    request.list(entity)
  );
  console.log("use query data", data);
  useEffect(() => {}, [data]);
  return (
    <>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={data && data.result}
        pagination={false}
        loading={isLoading}
      />
    </>
  );
}
