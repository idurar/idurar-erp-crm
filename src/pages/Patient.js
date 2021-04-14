import React, { useRef, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { Layout, Breadcrumb } from "antd";
import { DatePicker, TimePicker, Calendar } from "@/components/antd";
import CrudPanel from "@/components/CrudPanel";

const { Content } = Layout;

function CustomerPage() {
  const entity = "patient";
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
    },
    {
      title: "Gender",
      dataIndex: "sexe",
    },
  ];
  return (
    <DashboardLayout
      contentLayout={
        <Content style={{ margin: "0 16px" }}>
          <CrudPanel entity={entity} columns={columns} />
        </Content>
      }
    />
  );
}

export default CustomerPage;
