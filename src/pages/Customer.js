import React from "react";

import CrudPanel from "@/components/CrudPanel";
import FormCustomer from "@/forms/FormCustomer";

function Customer() {
  const entity = "client";
  const searchConfig = {
    displayLabels: ["company"],
    searchFields: "company,managerSurname,managerName",
    outputField: "_id",
  };

  const panelTitle = "Customer Panel";
  const dataTableTitle = "Patients Lists";
  const entityDisplayLabels = ["company"];

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

  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudPanel
      entity={entity}
      dataTableColumns={dataTableColumns}
      createForm={<FormCustomer />}
      readColumns={readColumns}
      searchConfig={searchConfig}
      config={config}
    />
  );
}

export default Customer;
