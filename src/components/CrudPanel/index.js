import React, { useState, useCallback, useEffect } from "react";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";
import DataTable from "./DataTable";
import { useCrudContext, CrudProvider } from "./Context";
import uniqueid from "@/utils/uniqueid";

function Count() {
  const { state } = useCrudContext();
  return <span>{`${state.count}`}</span>;
}

function CounterButton() {
  const { crudContextAction } = useCrudContext();
  return <Button onClick={crudContextAction.increment}>Count Increment</Button>;
}
export default function CrudPanel({ entity, columns }) {
  return (
    <CrudProvider>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={
          <Tag color="blue">
            the count is :<Count />
          </Tag>
        }
        subTitle="This is customer page"
        extra={[
          <CounterButton key={`${uniqueid()}`} />,
          <Button key={`${uniqueid()}`} type="primary">
            Add new Customer
          </Button>,
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
    </CrudProvider>
  );
}
