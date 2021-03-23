import React, { useRef, useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { Layout, Breadcrumb } from "antd";
import { DatePicker, TimePicker, Calendar } from "../antdcomponents";
import DataTable from "../components/DataTable";
import format from "dayjs";
import CustomerTable from "../components/customerTable";


const { Content } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
function CustomerPage() {
  const target = "client";
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Manager Surname",
      dataIndex: "managerSurname",
    },
    {
      title: "Manager Name",
      dataIndex: "managerName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];
  return (
    <DashboardLayout
      contentLayout={
        <Content style={{ margin: "0 16px" }}>
          {/* <DataTable target={target} columns={columns} /> */}
          <CustomerTable columns={columns} />
        </Content>
      }
    />
  );
}

export default CustomerPage;
