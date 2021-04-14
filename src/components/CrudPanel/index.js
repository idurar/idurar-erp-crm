import React, { useState, useCallback, useEffect } from "react";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";
import DataTable from "./DataTable";

export default function CrudPanel({ entity, columns }) {
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is customer page"
        extra={[
          <Button key="2">Refresh</Button>,
          <Button key="1" type="primary">
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
    </>
  );
}
