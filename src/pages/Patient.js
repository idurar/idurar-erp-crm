import React from "react";

import { DefaultLayout } from "@/layout";
import CrudPanel from "@/components/CrudPanel";
import FormPatient from "@/components/FormPatient";

function CustomerPage() {
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
    <DefaultLayout>
      <CrudPanel entity={entity} columns={columns} newForm={<FormPatient />} />
    </DefaultLayout>
  );
}

export default CustomerPage;
