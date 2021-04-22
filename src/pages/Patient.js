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
    <DefaultLayout
      SidePanelContent={
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      }
    >
      <CrudPanel entity={entity} columns={columns} newForm={<FormPatient />} />
    </DefaultLayout>
  );
}

export default CustomerPage;
