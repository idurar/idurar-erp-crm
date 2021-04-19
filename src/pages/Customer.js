import React from "react";
import { DefaultLayout } from "@/layout";
import { Layout } from "antd";

import CrudPanel from "@/components/CrudPanel";
import FormCustomer from "@/components/FormCustomer";

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
    <DefaultLayout>
      <Content style={{ margin: "0 16px" }}>
        <CrudPanel
          entity={entity}
          columns={columns}
          newForm={<FormCustomer />}
        />
      </Content>
    </DefaultLayout>
  );
}

export default CustomerPage;
