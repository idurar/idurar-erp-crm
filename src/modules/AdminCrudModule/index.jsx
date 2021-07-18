import React, { useLayoutEffect } from "react";
import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CreateForm from "@/components/CreateForm";
import UpdateForm from "@/components/UpdateForm";
import DeleteModal from "@/components/DeleteModal";
import ReadItem from "@/components/ReadItem";
import SearchItem from "@/components/SearchItem";

import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";

import { CrudLayout } from "@/layout";

import AdminDataTable from "./AdminDataTable";
import UpdatePassword from "./UpdatePassword";

function SidePanelTopContent({ config, formElements }) {
  return (
    <>
      <ReadItem config={config} />
      <UpdateForm config={config} formElements={formElements} />
      <UpdatePassword config={config} />
    </>
  );
}

function FixHeaderPanel({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox } = crudContextAction;

  const addNewItem = () => {
    collapsedBox.close();
  };
  return (
    <div className="box">
      <Row gutter={12}>
        <Col className="gutter-row" span={21}>
          <h1 style={{ fontSize: 20, marginBottom: 20 }}>
            {config.panelTitle}
          </h1>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col className="gutter-row" span={21}>
          <SearchItem config={config} />
        </Col>
        <Col className="gutter-row" span={3}>
          <Button
            onClick={addNewItem}
            block={true}
            icon={<PlusOutlined />}
          ></Button>
        </Col>
      </Row>
    </div>
  );
}

function AdminCrudModule({ config, createForm, updateForm }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelBottomContent={
        <CreateForm config={config} formElements={createForm} />
      }
      sidePanelTopContent={
        <SidePanelTopContent config={config} formElements={updateForm} />
      }
    >
      <AdminDataTable config={config} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default AdminCrudModule;
