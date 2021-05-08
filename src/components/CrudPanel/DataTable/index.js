import React, { useCallback, useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { listAction } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";
import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";

function AddNewItem() {
  const { uiContextAction } = useUiContext();
  return (
    <Button onClick={uiContextAction.panel.open} type="primary">
      Add new Customer
    </Button>
  );
}
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
    dispatch(listAction(entity));
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is customer page"
        extra={[
          <Button key={`${uniqueId()}`}>Refresh</Button>,
          <AddNewItem key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value="Pending" />
          <Statistic
            title="Price"
            prefix="$"
            value={568.08}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic title="Balance" prefix="$" value={3345.08} />
        </Row>
      </PageHeader>
      <Table
        columns={columns}
        rowKey={(item) => item._id}
        dataSource={items}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
      />
    </>
  );
}
