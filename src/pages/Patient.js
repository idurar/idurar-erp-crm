import React, { useRef, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Layout, Breadcrumb } from "antd";
import { DatePicker, TimePicker, Calendar } from "../antdcomponents";
import DataTable from "../components/DataTable";
import format from "dayjs";
const { Content } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
function CustomerPage() {
  const target = "patient";
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
          <DataTable target={target} columns={columns} />
        </Content>
      }
    />
  );
}

export default CustomerPage;
