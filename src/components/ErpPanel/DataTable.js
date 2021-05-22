import React, { useCallback, useEffect } from "react";
import { Dropdown, Menu, Table } from "antd";
import { Button, PageHeader, Tag } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { erp } from "@/redux/erp/actions";
import { selectListItems, selectItemById } from "@/redux/erp/selectors";
import { useErpContext } from "@/context/erp";
import uniqueId from "@/utils/uniqueId";
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
function DropDownRowMenu({ row, entity }) {
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();
  const { readPanel, updatePanel, modal } = erpContextAction;
  const item = useSelector(selectItemById(row._id));
  const Show = () => {
    dispatch(erp.currentItem(item));
    readPanel.open();
  };
  function Edit() {
    dispatch(erp.currentAction("update", item));
    updatePanel.open();
  }
  function Delete() {
    dispatch(erp.currentAction("delete", item));
    modal.open();
  }
  function Download() {
    window.open(
      `${DOWNLOAD_BASE_URL}${entity}/${entity}-${row._id}.pdf`,
      "_blank"
    );
  }
  return (
    <Menu style={{ width: 130 }}>
      <Menu.Item icon={<EyeOutlined />} onClick={Show}>
        Show
      </Menu.Item>
      <Menu.Item icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
      <Menu.Item icon={<FilePdfOutlined />} onClick={Download}>
        Download
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} onClick={Delete}>
        Delete
      </Menu.Item>
    </Menu>
  );
}

export default function DataTable({ config }) {
  let { entity, dataTableColumns } = config;
  const { DATATABLE_TITLE } = config;
  dataTableColumns = [
    ...dataTableColumns,
    {
      title: "",
      render: (row) => (
        <Dropdown
          overlay={DropDownRowMenu({ row, entity })}
          trigger={["click"]}
        >
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
