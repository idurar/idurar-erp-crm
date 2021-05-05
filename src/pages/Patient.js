import React from "react";

import CrudPanel from "@/components/CrudPanel";
import FormPatient from "@/forms/FormPatient";

function Patient() {
  const entity = "patient";
  const searchConfig = {
    displayLabels: ["name", "surname"],
    searchFields: "name,surname,birthday",
  };
  const dataTableColumns = [
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
  const readColumns = [
    {
      title: "Nom",
      dataIndex: "name",
    },
    {
      title: "Prenom",
      dataIndex: "surname",
    },
    {
      title: "Date de naissance",
      dataIndex: "birthday",
    },
    {
      title: "Sexe",
      dataIndex: "sexe",
    },
  ];
  const panelTitle = "Patient";
  const dataTableTitle = "Patients Lists";
  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    readColumns,
    dataTableColumns,
    searchConfig,
  };
  return (
    <CrudPanel
      entity={entity}
      dataTableColumns={dataTableColumns}
      createForm={<FormPatient />}
      readColumns={readColumns}
      searchConfig={searchConfig}
      config={config}
    />
  );
}

export default Patient;
