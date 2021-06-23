import React from "react";

import CrudPanel from "@/components/CrudPanel";
import UserForm from "@/forms/UserForm";

export default function User() {
  const entity = "user";
  const searchConfig = {
    displayLabels: ["name,email"],
    searchFields: "email,name,surname",
    outputValue: "_id",
  };

  const panelTitle = "User Panel";
  const dataTableTitle = "User Lists";
  const entityDisplayLabels = ["email"];

  const readColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Surname", dataIndex: "surname" },
    { title: "Email", dataIndex: "email" },
    { title: "Type de Compte", dataIndex: "accountType" },
    { title: "Role d'utilisateur", dataIndex: "role.displayName" },
  ];

  const dataTableColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Surname", dataIndex: "surname" },
    { title: "Email", dataIndex: "email" },
    { title: "Type de Compte", dataIndex: "accountType" },
    { title: "Role d'utilisateur", dataIndex: ["role", "displayName"] },
  ];
  const ADD_NEW_ENTITY = "Add new user";
  const DATATABLE_TITLE = "users List";
  const ENTITY_NAME = "user";
  const CREATE_ENTITY = "Create user";
  const UPDATE_ENTITY = "Update user";

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
      createForm={<UserForm />}
      updateForm={<UserForm isUpdateForm={true} />}
      readColumns={readColumns}
      searchConfig={searchConfig}
      config={config}
    />
  );
}
