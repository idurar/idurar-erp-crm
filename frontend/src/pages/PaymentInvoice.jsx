import React from "react";
import CrudModule from "@/modules/CrudModule";
import CurrencyForm from "@/forms/CurrencyForm";

export default function PaymentInvoice() {
  const entity = "paymentInvoice";
  const searchConfig = {
    displayLabels: ["name"],
    searchFields: "name",
    outputValue: "_id",
  };

  const entityDisplayLabels = ["name"];

  const readColumns = [
    {
      title: "Currency Name",
      dataIndex: "name",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
    },
    {
      title: "Decimal Sep",
      dataIndex: "decimalSeparator",
    },
    {
      title: "Thousand Sep",
      dataIndex: "thousandSeparator",
    },
    {
      title: "Default",
      dataIndex: "isDefault",
    },
  ];
  const dataTableColumns = [
    {
      title: "Client",
      dataIndex: ["client", "company"],
    },
    {
      title: "Invoice Number",
      dataIndex: ["invoice", "number"],
    },
    {
      title: "Invoice Year",
      dataIndex: ["invoice", "year"],
    },
    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  const ADD_NEW_ENTITY = "Add new payment";
  const DATATABLE_TITLE = "payments List";
  const ENTITY_NAME = "payment";
  const CREATE_ENTITY = "Create payment";
  const UPDATE_ENTITY = "Update payment";
  const PANEL_TITLE = "Currency Panel";

  const config = {
    entity,
    PANEL_TITLE,
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
    <CrudModule
      createForm={<CurrencyForm />}
      updateForm={<CurrencyForm isUpdateForm={true} />}
      config={config}
    />
  );
}
