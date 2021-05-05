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
import { crud } from "@/redux/crud/actions";
import { selectListItems, selectItemById } from "@/redux/crud/selectors";
import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";

function AddNewItem() {
  const { uiContextAction } = useUiContext();
  const { collapsedBox, panel } = uiContextAction;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      Add new Customer
    </Button>
  );
}
function DropDownRowMenu({ row }) {
  const dispatch = useDispatch();
  const { state, uiContextAction } = useUiContext();
  const { panel, collapsedBox, modal, readBox } = uiContextAction;
  const item = useSelector(selectItemById(row._id));
  const Show = () => {
    dispatch(crud.currentItem(item));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function Edit() {
    dispatch(crud.currentAction("update", item));
    readBox.close();
    panel.open();
    collapsedBox.open();
  }
  function Delete() {
    dispatch(crud.currentAction("delete", item));
    modal.open();
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
}

export default function DataTable({ entity, dataTableColumns }) {
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

  const {
    result: listResult,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useSelector(selectListItems);

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(crud.list(entity, pagination.current));
  }, []);

  useEffect(() => {
    dispatch(crud.list(entity));
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
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
            Refresh
          </Button>,
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
