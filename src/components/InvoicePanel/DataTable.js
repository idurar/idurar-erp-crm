import React, { useCallback, useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import { Button, PageHeader, Tag } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { selectListItems, selectItemById } from "@/redux/invoice/selectors";
import { useInvoiceContext } from "@/context/invoice";
import uniqueId from "@/utils/uniqueId";

function AddNewItem() {
  const { invoiceContextAction } = useInvoiceContext();
  const { createPanel } = invoiceContextAction;
  const handelClick = () => {
    createPanel.open();
  };

  return (
    <Button onClick={handelClick} type="primary">
      Add new Invoice
    </Button>
  );
}
function DropDownRowMenu({ row }) {
  const dispatch = useDispatch();
  const { invoiceContextAction } = useInvoiceContext();
  const { readPanel, updatePanel, modal } = invoiceContextAction;
  const item = useSelector(selectItemById(row._id));
  const Show = () => {
    dispatch(invoice.currentItem(item));
    readPanel.open();
  };
  function Edit() {
    dispatch(invoice.currentAction("update", item));
    updatePanel.open();
  }
  function Delete() {
    dispatch(invoice.currentAction("delete", item));
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

export default function DataTable({ config }) {
  let { entity, dataTableColumns } = config;
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

  const { result: listResult, isLoading: listIsLoading } = useSelector(
    selectListItems
  );

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(invoice.list(entity, pagination.current));
  }, []);

  useEffect(() => {
    dispatch(invoice.list(entity));
  }, []);

  return (
    <>
      <PageHeader
        // onBack={() => window.history.back()}
        title="Invoices List"
        ghost={true}
        // tags={<Tag color="blue">Running</Tag>}
        // subTitle="This is customer page"
        extra={[
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`}>
            Refresh
          </Button>,
          <AddNewItem key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
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
