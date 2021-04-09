import React from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { Layout } from "antd";

import CustomerTable from "@/components/CustomerTable";

const { Content } = Layout;

function CustomerPage() {
  const entity = "client";
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
          <CustomerTable entity={entity} columns={columns} />
        </Content>
      }
    />
  );
}

export default CustomerPage;
