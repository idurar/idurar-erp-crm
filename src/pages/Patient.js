import React from "react";

import CrudPanel from "@/components/CrudPanel";
import FormPatient from "@/forms/FormPatient";

function Patient() {
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
    <CrudPanel entity={entity} columns={columns} createForm={<FormPatient />} />
  );
}

export default Patient;
