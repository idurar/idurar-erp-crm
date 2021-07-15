import React from "react";

import CrudPanel from "@/components/CrudPanel";
import AdminForm from "@/forms/AdminForm";

export default function Admin() {
  const entity = "admin";
  const searchConfig = {
    displayLabels: ["name,email"],
    searchFields: "email,name,surname",
    outputValue: "_id",
  };

  const panelTitle = "Admin Panel";
  const dataTableTitle = "Admin Lists";
  const entityDisplayLabels = ["email"];

  const readColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Surname", dataIndex: "surname" },
    { title: "Email", dataIndex: "email" },
    { title: "Role d'utilisateur", dataIndex: "role.displayName" },
  ];

  const dataTableColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Surname", dataIndex: "surname" },
    { title: "Email", dataIndex: "email" },
    { title: "Role d'utilisateur", dataIndex: ["role", "displayName"] },
  ];
  const ADD_NEW_ENTITY = "Add new admin";
  const DATATABLE_TITLE = "Admins List";
  const ENTITY_NAME = "admin";
  const CREATE_ENTITY = "Create admin";
  const UPDATE_ENTITY = "Update admin";

  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudPanel
      entity={entity}
      dataTableColumns={dataTableColumns}
      createForm={<AdminForm />}
      updateForm={<AdminForm isUpdateForm={true} />}
      readColumns={readColumns}
      searchConfig={searchConfig}
      config={config}
    />
  );
}
