import React, { useLayoutEffect } from "react";

import DataTable from "./DataTable";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";

import { useDispatch } from "react-redux";
import { resetCrudState } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";

import { CrudLayout } from "@/layout";

function CrudPanel({ columns, entity, createForm, updateForm }) {
  const dispatch = useDispatch();
  let form = {};
  updateForm === undefined ? (form = createForm) : (form = updateForm);

  useLayoutEffect(() => {
    dispatch(resetCrudState());
  }, []);

  return (
    <CrudLayout
      sidePanelBottomContent={
        <Create entity={entity} formElements={createForm} />
      }
      sidePanelTopContent={<Update entity={entity} formElements={form} />}
    >
      <DataTable columns={columns} entity={entity} />
      <Delete entity={entity} />
    </CrudLayout>
  );
}

export default CrudPanel;
