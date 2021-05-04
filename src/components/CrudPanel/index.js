import React, { useEffect, useLayoutEffect } from "react";

import DataTable from "./DataTable";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";
import Read from "./Read";
import Search from "./Search";

import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";

import { CrudLayout } from "@/layout";

function SidePanelTopContent({ entity, readColumns, formElements }) {
  return (
    <>
      <Read readColumns={readColumns} />
      <Update entity={entity} formElements={formElements} />
    </>
  );
}

function CrudPanel({
  entity,
  dataTableColumns,
  readColumns,
  searchConfig,
  createForm,
  updateForm,
}) {
  const dispatch = useDispatch();
  let form = {};
  updateForm === undefined ? (form = createForm) : (form = updateForm);

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      fixHeaderPanel={<Search entity={entity} searchConfig={searchConfig} />}
      sidePanelBottomContent={
        <Create entity={entity} formElements={createForm} />
      }
      sidePanelTopContent={
        <SidePanelTopContent
          readColumns={readColumns}
          entity={entity}
          formElements={form}
        />
      }
    >
      <DataTable dataTableColumns={dataTableColumns} entity={entity} />
      <Delete entity={entity} />
    </CrudLayout>
  );
}

export default CrudPanel;
