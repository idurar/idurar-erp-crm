import React, { useCallback, useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import { Button, PageHeader, Tag } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { erp } from "@/redux/erp/actions";
import { selectListItems, selectItemById } from "@/redux/erp/selectors";
import { useErpContext } from "@/context/erp";
import uniqueId from "@/utils/uinqueId";
import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";
import { RedoOutlined, PlusOutlined } from "@ant-design/icons";
function AddNewItem({ config }) {
  const { ADD_NEW_ENTITY, DATATABLE_TITLE } = config;
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
      title: "",
      render: (row) => (
        <Dropdown
          overlay={DataTableDropMenu({ row, entity })}
          trigger={["click"]}
        >
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(erp.list(entity, pagination.current));
  }, []);

  useEffect(() => {
    dispatch(erp.list(entity));
  }, []);

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        extra={[
          <Button
            onClick={handelDataTableLoad}
            key={`${uniqueId()}`}
            icon={<RedoOutlined />}
          >
            Refresh
          </Button>,
          <AddNewItem config={config} key={`${uniqueId()}`} />,
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
