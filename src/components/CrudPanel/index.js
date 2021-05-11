import React, { useLayoutEffect } from "react";
import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DataTable from "./DataTable";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";
import Read from "./Read";
import Search from "./Search";

import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";

import { CrudLayout } from "@/layout";

function SidePanelTopContent({ config, formElements }) {
  return (
    <>
      <Read config={config} />
      <Update config={config} formElements={formElements} />
    </>
  );
}

function FixHeaderPanel({ config }) {
  const { uiContextAction } = useUiContext();
  const { collapsedBox } = uiContextAction;

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
          <Search config={config} />
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

function CrudPanel({ config, createForm, updateForm }) {
  const dispatch = useDispatch();
  let form = {};
  updateForm === undefined ? (form = createForm) : (form = updateForm);

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelBottomContent={
        <Create config={config} formElements={createForm} />
      }
      sidePanelTopContent={
        <SidePanelTopContent config={config} formElements={form} />
      }
    >
      <DataTable config={config} />
      <Delete config={config} />
    </CrudLayout>
  );
}

export default CrudPanel;
