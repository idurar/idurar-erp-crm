import React from "react";

import CrudPanel from "@/components/CrudPanel";
import FormCustomer from "@/forms/FormCustomer";

function Customer() {
  const entity = "client";
  const readColumns = [
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
    {
      title: "Phone",
      dataIndex: "phone",
    },
  ];
  const dataTableColumns = [
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
    <CrudPanel
      entity={entity}
      dataTableColumns={dataTableColumns}
      readColumns={readColumns}
      createForm={<FormCustomer />}
    />
  );
}

export default Customer;
