import React, { useLayoutEffect } from "react";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";
import DataTable from "./DataTable";
import CreateModal from "./CreateModal";
import { useDispatch } from "react-redux";
import { resetCrudState } from "@/redux/crud/actions";
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
export default function CrudPanel({ columns, entity, newForm }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(resetCrudState());
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
      <DataTable columns={columns} entity={entity} />

      <CreateModal newForm={newForm}></CreateModal>
    </>
  );
}
